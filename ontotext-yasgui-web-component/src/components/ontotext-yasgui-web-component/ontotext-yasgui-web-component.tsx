import {Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch} from '@stencil/core';
import {defaultOntotextYasguiConfig, RenderingMode} from '../../models/yasgui-configuration';
import {YASGUI_MIN_SCRIPT} from '../yasgui/yasgui-script';
import {YasguiBuilder} from '../../services/yasgui/yasgui-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {VisualisationUtils} from '../../services/utils/visualisation-utils';
import {HtmlElementsUtil} from '../../services/utils/html-elements-util';
import {OntotextYasguiService} from '../../services/yasgui/ontotext-yasgui-service';
import {ExternalYasguiConfiguration, TabQueryModel} from "../../models/external-yasgui-configuration";
import {TranslationService} from '../../services/translation.service';
import {ServiceFactory} from '../../services/service-factory';
import {YasguiConfigurationBuilder} from '../../services/yasgui/configuration/yasgui-configuration-builder';
import {SavedQueriesData, SavedQueryConfig, SaveQueryData, UpdateQueryData} from "../../models/saved-query-configuration";
import {ConfirmationDialogConfig} from "../confirmation-dialog/confirmation-dialog";
import {ShareQueryDialogConfig} from '../share-query-dialog/share-query-dialog';
import {OutputEvent, toOutputEvent} from '../../models/output-events/output-event';
import {InternalDownloadAsEvent} from '../../models/internal-events/internal-download-as-event';
import {InternalCountQueryEvent} from '../../models/internal-events/internal-count-query-event';
import {InternalQueryEvent} from '../../models/internal-events/internal-query-event';
import {NotificationMessageService} from '../../services/notification-message-service';
import {InternalNotificationMessageEvent, MessageCode} from '../../models/internal-events/internal-notification-message-event';
import {InternalShowResourceCopyLinkDialogEvent} from '../../models/internal-events/internal-show-resource-copy-link-dialog-event';
import {InternalShowSavedQueriesEvent} from '../../models/internal-events/internal-show-saved-queries-event';
import {InternalQueryExecuted} from '../../models/internal-events/internal-query-executed';
import {InternalCountQueryResponseEvent} from '../../models/internal-events/internal-count-query-response-event';
import {YasqeButtonType} from '../../models/yasqe-button-name';
import {YasqeService} from '../../services/yasqe/yasqe-service';
import {YasrService} from '../../services/yasr/yasr-service';
import {PivotTablePlugin} from '../../plugins/yasr/pivot-table/pivot-table-plugin';
import {ChartsPlugin} from "../../plugins/yasr/charts/charts-plugin";

/**
 * This is the custom web component which is adapter for the yasgui library. It allows as to
 * configure and extend the library without potentially breaking the component clients.
 *
 * The component have some sane defaults for most of its configurations. So, in practice, it can be
 * used as is by providing just the sparql endpoint config.
 * For other customizations, the default configurations can be overridden by providing an external
 * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
 * component.
 *
 * There is a configuration watcher which triggers the initialization again after a change is
 * detected.
 *
 * During the component initialization, the provided external configuration is passed down to a
 * configuration builder which use it to override and extend the yasgui library defaults.
 *
 * After the configuration is ready, then a yasgui instance is created with it.
 *
 * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
 * yasgui can be tweaked using the values from the configuration.
 */
@Component({
  tag: 'ontotext-yasgui',
  styleUrl: 'ontotext-yasgui-web-component.scss',
  shadow: false,
})
export class OntotextYasguiWebComponent {
  private readonly translationService: TranslationService;
  private readonly serviceFactory: ServiceFactory;
  private readonly yasguiConfigurationBuilder: YasguiConfigurationBuilder;
  private readonly yasguiBuilder: YasguiBuilder;
  private readonly ontotextYasguiService: OntotextYasguiService;
  private readonly notificationMessageService: NotificationMessageService;

  /**
   * The instance of our adapter around the actual yasgui instance.
   */
  ontotextYasgui: OntotextYasgui;

  constructor() {
    this.serviceFactory = new ServiceFactory(this.hostElement);
    this.translationService = this.serviceFactory.get(TranslationService);
    this.yasguiConfigurationBuilder = this.serviceFactory.get(YasguiConfigurationBuilder);
    this.yasguiBuilder = this.serviceFactory.get(YasguiBuilder);
    this.ontotextYasguiService = this.serviceFactory.get(OntotextYasguiService);
    this.notificationMessageService = this.serviceFactory.get(NotificationMessageService);
  }

  /**
   * The host html element for the yasgui.
   */
  @Element() hostElement: HTMLElement;

  /**
   * An input object property containing the yasgui configuration.
   */
  @Prop() config: ExternalYasguiConfiguration;
  @Watch('config')
  configurationChanged(newConfig: ExternalYasguiConfiguration) {
    this.init(newConfig);
  }

  /**
   * An input property containing the chosen translation language.
   */
  @Prop() language: string
  @Watch('language')
  languageChanged(newLang: string) {
    this.translationService.setLanguage(newLang);
    this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        ontotextYasgui.refresh();
      });
  }

  /**
   * A configuration model related with all the saved queries actions.
   */
  @Prop() savedQueryConfig?: SavedQueryConfig;
  @Watch('savedQueryConfig')
  savedQueryConfigChanged() {
    this.shouldShowSaveQueryDialog();
    this.shouldShowSavedQueriesPopup();
    this.saveQueryData = this.initSaveQueryData();
  }

  /**
   * Event emitted when saved query payload is collected and the query should be saved by the
   * component client.
   */
  @Event() createSavedQuery: EventEmitter<SaveQueryData>;

  /**
   * Event emitted when a query payload is updated and the query name is the same as the one being
   * edited. In result the client must perform a query update.
   */
  @Event() updateSavedQuery: EventEmitter<SaveQueryData>;

  /**
   * Event emitted when a saved query should be deleted. In result the client must perform a query
   * delete.
   */
  @Event() deleteSavedQuery: EventEmitter<SaveQueryData>;

  /**
   * Event emitted when saved queries is expected to be loaded by the component client and provided
   * back in order to be displayed.
   */
  @Event() loadSavedQueries: EventEmitter<boolean>;

  /**
   * Event emitted when saved query share link has to be build by the client.
   */
  @Event() shareSavedQuery: EventEmitter<SaveQueryData>;

  /**
   * Event emitted when query share link gets copied in the clipboard.
   */
  @Event() queryShareLinkCopied: EventEmitter;

  /**
   * Event emitted when saved query share link has to be build by the client.
   */
  @Event() shareQuery: EventEmitter<TabQueryModel>;

  /**
   * Event emitter used to send message to the clients of component.
   */
  @Event() output: EventEmitter<OutputEvent>;

  /**
   * A model which is set when query details are populated and the query is going to be saved.
   */
  @State() saveQueryData: SaveQueryData;

  /**
   * A model which is set when an existing saved query is edited and is going to be saved.
   */
  @State() savedQueryData: SaveQueryData;

  /**
   * A query model which is set when a query is set to be deleted.
   */
  @State() deleteQueryData: SaveQueryData;

  /**
   * If the yasgui layout is oriented vertically or not.
   */
  @State() isVerticalOrientation = true;

  /**
   * Holds the rendering mode currently applied to the yasgui component.
   */
  @State() renderingMode = this.getRenderMode();

  /**
   * Flag controlling the visibility of the save query dialog.
   */
  @State() showSaveQueryDialog = false;

  /**
   * Flag controlling the visibility of the saved queries list popup.
   */
  @State() showSavedQueriesPopup = false;

  @State() showSavedQueriesPopupTarget: HTMLElement;

  @State() showConfirmationDialog = false;

  @State() showShareQueryDialog = false;

  @State() showCopyResourceLinkDialog = false;

  @State() copiedResourceLink: string;

  @State() loaderMessage: string;

  @State() additionalLoaderMessage: string;

  /**
   * Changes rendering mode of component.
   *
   * @param newRenderMode - then new render mode of component.
   */
  @Method()
  changeRenderMode(newRenderMode): Promise<void> {
    return this.getOntotextYasgui()
      .then(() => {
        VisualisationUtils.changeRenderMode(this.hostElement, newRenderMode, this.getOrientationMode());
      });
  }

  /**
   * Allows the client to set a query in the current opened tab.
   * The cursor position is preserved.
   *
   * @param query The query that should be set in the current focused tab.
   */
  @Method()
  setQuery(query: string): Promise<void> {
    return this.getOntotextYasgui()
      .then(() => {
        this.ontotextYasgui.setQuery(query)
      });
  }

  /**
   * Executes the yasqe query.
   */
  @Method()
  query(): Promise<any> {
    return this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        console.log('run query', );
        return ontotextYasgui.query();
      });
  }

  /**
   * Fetches the query from YASQE editor.
   */
  @Method()
  getQuery(): Promise<string> {
    return this.getOntotextYasgui()
      .then(() => {
        return this.ontotextYasgui.getQuery();
      });
  }

  /**
   * Checks if query is valid.
   */
  @Method()
  isQueryValid(): Promise<boolean> {
    return this.getOntotextYasgui()
      .then(() => {
        return this.ontotextYasgui.isQueryValid();
      });
  }

  /**
   * Allows the client to init the editor using a query model. When the query and query name are
   * found in any existing opened tab, then it'd be focused. Otherwise a new tab will be created and
   * initialized using the provided query model.
   * @param queryModel The query model.
   */
  @Method()
  openTab(queryModel: TabQueryModel): Promise<void> {
    // While this does the job in this particular method, we definitely need a more general approach
    // for handling the fact that there is a chance for the client to hit the problem where when the
    // OntotextYasgui instance is created and returned the wrapped Yasgui instance might not be yet
    // initialized.
    return this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        ontotextYasgui.openTab(queryModel)
      });
  }

  /**
   * Utility method allowing the client to get the mode of the query which is written in the current
   * editor tab.
   * The query mode can be either `query` or `update` regarding the query mode. This method just
   * exposes the similar utility method from the yasqe component.
   *
   * @return A promise which resolves with a string representing the query mode.
   */
  @Method()
  getQueryMode(): Promise<string> {
    return this.getOntotextYasgui().then((ontotextYasgui) => {
      return ontotextYasgui.getQueryMode();
    })
  }

  /**
   * Utility method allowing the client to get the type of the query which is written in the current
   * editor tab.
   * The query mode can be `INSERT`, `LOAD`, `CLEAR`, `DELETE`, etc. This method just exposes the
   * similar utility method from the yasqe component.
   *
   * @return A promise which resolves with a string representing the query type.
   */
  @Method()
  getQueryType(): Promise<string> {
    return this.getOntotextYasgui().then((ontotextYasgui) => {
      return ontotextYasgui.getQueryType();
    })
  }

  /**
   * Fetches the query result and return it as JSON.
   */
  @Method()
  getEmbeddedResultAsJson(): Promise<unknown> {
    return this.getOntotextYasgui().then((ontotextYasgui) => {
      return ontotextYasgui.getEmbeddedResultAsJson();
    });
  }

  /**
   * Fetches the query result and return it as CSV.
   */
  @Method()
  getEmbeddedResultAsCSV(): Promise<unknown> {
    return this.getOntotextYasgui().then((ontotextYasgui) => {
      return ontotextYasgui.getEmbeddedResultAsCSV();
    });
  }

  /**
   * Hides the YASQE action button with the name <code>yasqeActionButtonNames</code>.
   *
   * @param yasqeActionButtonNames - the name of the action that needs to be hidden.
   */
  @Method()
  hideYasqeActionButton(yasqeActionButtonNames: YasqeButtonType | YasqeButtonType[]): Promise<void> {
    return this.getOntotextYasgui().then(() => YasqeService.hideYasqeActionButtons(yasqeActionButtonNames));
  }

  /**
   * Shows the YASQE action button with the name <code>yasqeActionButtonNames</code>.
   *
   * @param yasqeActionButtonNames - the name of the action that needs to be displayed.
   */
  @Method()
  showYasqeActionButton(yasqeActionButtonNames: YasqeButtonType | YasqeButtonType[]): Promise<void> {
    return this.getOntotextYasgui().then(() => YasqeService.showYasqeActionButtons(yasqeActionButtonNames));
  }

  /**
   * Aborts the running query if any.
   */
  @Method()
  abortQuery(): Promise<any> {
    return this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        ontotextYasgui.abortQuery();
      });
  }

  /**
   * There are rendering problems when the window size is changed. To address this, we added a listener to the window resize event.
   * When the event occurs, we refresh the component to recalculate and resolve the rendering issues.
   */
  @Listen('resize', {target: 'window'})
  onResize() {
    this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        ontotextYasgui.refresh();
        VisualisationUtils.setYasqeFullHeight(this.renderingMode, VisualisationUtils.resolveOrientation(this.isVerticalOrientation));
      });
  }

  /**
   * Handler for the event fired when the save query button in the yasqe toolbar is triggered.
   */
  @Listen('internalCreateSavedQueryEvent')
  saveQueryHandler() {
    this.showSaveQueryDialog = true;
    this.saveQueryData = this.getDefaultSaveQueryData();
  }

  /**
   * Handler for the event fired when the query should be saved by the component client.
   */
  @Listen('internalSaveQueryEvent')
  createSavedQueryHandler(event: CustomEvent<SaveQueryData>) {
    this.createSavedQuery.emit(event.detail);
  }

  /**
   * Handler for the event fired when the query should be saved by the component client.
   */
  @Listen('internalUpdateQueryEvent')
  updateSavedQueryHandler(event: CustomEvent<UpdateQueryData>) {
    this.updateSavedQuery.emit(event.detail);
  }

  /**
   * Handler for the event fired when the saveQueryDialog gets closed.
   */
  @Listen('internalSaveQueryDialogClosedEvent')
  closeSaveDialogHandler() {
    this.showSaveQueryDialog = false;
  }

  /**
   * Handler for the event fired when the show saved queries button in the yasqe toolbar is triggered.
   */
  @Listen('internalShowSavedQueriesEvent')
  showSavedQueriesHandler(event: CustomEvent<InternalShowSavedQueriesEvent>) {
    this.loadSavedQueries.emit(true);
    this.showSavedQueriesPopup = true;
    this.showSavedQueriesPopupTarget = event.detail.buttonInstance;
  }

  /**
   * Handles the event fired when the saved query is selected from the saved queries list. Tries to
   * find a tab with the same name and query inside and opens it. Otherwise opens a new tab with
   * provided parameters.
   */
  @Listen('internalSaveQuerySelectedEvent')
  savedQuerySelectedHandler(event: CustomEvent<SaveQueryData>) {
    const queryData: SaveQueryData = event.detail;
    this.showSavedQueriesPopup = false;
    this.openTab({
      queryName: queryData.queryName,
      query: queryData.query,
      owner: undefined
    });
  }

  /**
   * Handler for the event fired when the edit saved query button is triggered.
   */
  @Listen('internalEditSavedQueryEvent')
  editSavedQueryHandler(event: CustomEvent<SaveQueryData>) {
    this.savedQueryData = event.detail
    this.showSavedQueriesPopup = false;
    this.showSaveQueryDialog = true;
  }

  /**
   * Handler for the event fired when the delete saved query button is triggered.
   */
  @Listen('internalSavedQuerySelectedForDeleteEvent')
  savedQuerySelectedForEditHandler(event: CustomEvent<SaveQueryData>) {
    this.showConfirmationDialog = true;
    this.deleteQueryData = event.detail;
  }

  /**
   * Handler for confirmation event fired when deletion of saved query is approved.
   */
  @Listen('internalConfirmationApprovedEvent')
  deleteSavedQueryHandler() {
    this.showConfirmationDialog = false;
    this.showSavedQueriesPopup = false;
    this.deleteSavedQuery.emit(this.deleteQueryData);
  }

  /**
   * Handler for the event for closing the saved query delete confirmation dialog.
   */
  @Listen('internalConfirmationRejectedEvent')
  closeSavedQueryDeleteConfirmationHandler() {
    this.showConfirmationDialog = false;
    this.showSavedQueriesPopup = false;
    this.deleteQueryData = undefined;
  }

  /**
   * Handler for the event for closing the saved queries popup.
   */
  @Listen('internalCloseSavedQueriesPopupEvent')
  closeSavedQueriesPopupHandler() {
    this.showSavedQueriesPopup = false;
  }

  /**
   * Handler for the event fired when the share saved query button is triggered.
   */
  @Listen('internalSavedQuerySelectedForShareEvent')
  savedQuerySelectedForShareHandler(event: CustomEvent<SaveQueryData>) {
    this.shareSavedQuery.emit(event.detail);
    this.showShareQueryDialog = true;
  }

  /**
   * Handler for the event fired when the share query button in the editor is triggered.
   */
  @Listen('internalShareQueryEvent')
  shareQueryHandler() {
    const query = this.ontotextYasgui.getQuery();
    const queryName = this.ontotextYasgui.getTabName();
    this.shareQuery.emit({
      queryName: queryName,
      query: query,
      owner: ''
    });
    this.showShareQueryDialog = true;
  }

  /**
   * Handler for the internal event fired when a query share link is copied in the clipboard.
   */
  @Listen('internalQueryShareLinkCopiedEvent')
  savedQueryShareLinkCopiedHandler() {
    this.showShareQueryDialog = false;
    this.queryShareLinkCopied.emit();
  }

  /**
   * Handler for the event for closing the share query dialog.
   */
  @Listen('internalShareQueryDialogClosedEvent')
  closeShareQueryDialogHandler() {
    this.showShareQueryDialog = false;
  }

  /**
   * Handler for the event fired when the copy link dialog is closed without copying the link to the clipboard.
   */
  @Listen('internalResourceLinkDialogClosedEvent')
  resourceLinkDialogClosedHandler() {
    this.showCopyResourceLinkDialog = false;
    this.copiedResourceLink = undefined;
  }

  /**
   * Handler for the event fired when the copy link dialog is closed when the link is copied to the clipboard.
   */
  @Listen('internalResourceLinkCopiedEvent')
  resourceLinkCopiedHandler() {
    const resourceCopiedMessage = this.translationService.translate('yasqe.share.copy_link.dialog.copy.message.success');
    this.notificationMessageService.success(MessageCode.RESOURCE_LINK_COPIED_SUCCESSFULLY, resourceCopiedMessage);
    this.showCopyResourceLinkDialog = false;
    this.copiedResourceLink = undefined;
  }

  /**
   * Handler for the event fired when the copy link dialog is closed when the link is copied to the clipboard.
   */
  @Listen('internalShowResourceCopyLinkDialogEvent')
  showResourceCopyLinkDialogHandler(event: CustomEvent<InternalShowResourceCopyLinkDialogEvent>) {
    this.copiedResourceLink = event.detail.payload.copyLink;
    this.showCopyResourceLinkDialog = true;
  }

  @Listen('internalDownloadAsEvent')
  onDownloadAsEventHandler(downloadAsEvent: CustomEvent<InternalDownloadAsEvent>) {
    this.output.emit(toOutputEvent(downloadAsEvent));
  }

  @Listen('internalNotificationMessageEvent')
  notificationMessageHandler(event: CustomEvent<InternalNotificationMessageEvent>) {
    this.output.emit(toOutputEvent(event));
  }

  @Listen('internalQueryEvent')
  onQuery(event: CustomEvent<InternalQueryEvent>): void {
    this.changeRenderMode(RenderingMode.YASGUI);
    this.output.emit(toOutputEvent(event));
  }

  @Listen('internalQueryExecuted')
  onInternalQueryExecuted(event: CustomEvent<InternalQueryExecuted>) {
    const queryExecuted = toOutputEvent(event);
    this.output.emit(queryExecuted);
  }

  @Listen('internalCountQueryEvent')
  onCountQuery(event: CustomEvent<InternalCountQueryEvent>) {
    this.output.emit(toOutputEvent(event));
  }

  @Listen('internalCountQueryResponseEvent')
  onCountQueryResponse(event: CustomEvent<InternalCountQueryResponseEvent>) {
    this.output.emit(toOutputEvent(event));
  }

  private resolveOrientationButtonTooltip(): string {
    return this.isVerticalOrientation ?
      this.translationService.translate('yasgui.toolbar.orientation.btn.tooltip.switch_orientation_horizontal') :
      this.translationService.translate('yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical');
  }

  private changeOrientation() {
    this.isVerticalOrientation = !this.isVerticalOrientation;
    VisualisationUtils.toggleLayoutOrientation(this.hostElement, this.isVerticalOrientation, this.renderingMode);
    this.getOntotextYasgui()
      .then((ontotextYasgui) => {
        ontotextYasgui.refresh();
      });
  }

  private getDefaultSaveQueryData(): SaveQueryData {
    return {
      queryName: '',
      query: '',
      owner: '',
      isPublic: false,
      messages: []
    };
  }

  private initSaveQueryData(): SaveQueryData {
    return {
      queryName: '',
      query: '',
      owner: '',
      isPublic: false,
      messages: this.savedQueryConfig?.errorMessage || []
    };
  }

  private getSaveQueryData(): SaveQueryData {
    const data: SaveQueryData = this.saveQueryData || this.getDefaultSaveQueryData();
    // first take into account if there is a saved query selected for edit
    // then take the data from the currently opened yasgui which means a new unsaved yet query
    if (this.savedQueryData) {
      data.queryName = this.savedQueryData.queryName;
      data.query = this.savedQueryData.query;
      data.isPublic = this.savedQueryData.isPublic;
      data.isNew = false;
    } else if (this.ontotextYasgui) {
      data.queryName = this.ontotextYasgui.getTabName();
      data.query = this.ontotextYasgui.getTabQuery();
      data.isPublic = false;
      data.isNew = true;
    }
    data.messages = this.saveQueryData && this.saveQueryData.messages;
    return data;
  }

  private getSaveQueriesData(): SavedQueriesData {
    const data: SavedQueriesData = {
      savedQueriesList: [],
      popupTarget: this.showSavedQueriesPopupTarget
    };
    if (this.savedQueryConfig && this.savedQueryConfig.savedQueries) {
      data.savedQueriesList = this.savedQueryConfig.savedQueries.map((savedQuery) => {
        return {
          queryName: savedQuery.queryName,
          query: savedQuery.query,
          isPublic: savedQuery.isPublic,
          owner: savedQuery.owner
        }
      });

    }
    return data;
  }

  private getRenderMode() {
    return this.config && this.config.render || defaultOntotextYasguiConfig.render;
  }

  private getOrientationMode() {
    return this.config && this.config.orientation || defaultOntotextYasguiConfig.orientation;
  }

  private shouldShowSaveQueryDialog(): void {
    this.showSaveQueryDialog = this.showSaveQueryDialog && !this.isSavedQuerySaved();
  }

  private isSavedQuerySaved() {
    return this.savedQueryConfig && this.savedQueryConfig.saveSuccess;
  }

  private shouldShowSavedQueriesPopup(): void {
    this.showSavedQueriesPopup = this.showSavedQueriesPopup && (this.savedQueryConfig?.savedQueries && this.savedQueryConfig?.savedQueries.length > 0);
  }

  private getDeleteQueryConfirmationConfig(): ConfirmationDialogConfig {
    return {
      title: this.translationService.translate('yasqe.actions.delete_saved_query.confirm.dialog.label'),
      message: this.translationService.translate('yasqe.actions.delete_saved_query.confirm.dialog.message', [{
        key: 'query',
        value: this.deleteQueryData.queryName
      }])
    }
  }

  private getShareLinkDialogConfig(): ShareQueryDialogConfig {
    return {
      dialogTitle: this.translationService.translate('yasqe.share.query.dialog.title'),
      shareQueryLink: this.savedQueryConfig?.shareQueryLink
    }
  }

  private getOntotextYasgui(): Promise<OntotextYasgui> {
    return new Promise((resolve, reject) => {
      if (this.isOntotextYasguiInitialiazed()) {
        return resolve(this.ontotextYasgui);
      }

      let maxIterationsToComplete = 15;
      const timer = setInterval(() => {
        maxIterationsToComplete--;
        if (this.isOntotextYasguiInitialiazed()) {
          clearInterval(timer);
          return resolve(this.ontotextYasgui);
        }
        if (maxIterationsToComplete === 0) {
          clearInterval(timer);
          return reject(`Can't initialize Yasgui!`);
        }
      }, 100);
    });
  }

  private changeRenderingMode(mode: RenderingMode): void {
    this.renderingMode = mode;
    VisualisationUtils.changeRenderMode(this.hostElement, mode, this.isVerticalOrientation);
  }

  private isOntotextYasguiInitialiazed(): boolean {
    return !!this.ontotextYasgui && !!this.ontotextYasgui.getInstance();
  }

  private afterInit(): void {
    // Configure the web component
    this.ontotextYasguiService.postConstruct(this.hostElement, this.ontotextYasgui.getConfig());
  }

  private destroy(): void {
    if (this.ontotextYasgui) {
      this.ontotextYasgui.destroy();
      const yasgui = HtmlElementsUtil.getOntotextYasgui(this.hostElement);
      while (yasgui.firstChild) {
        yasgui.firstChild.remove();
      }
    }
  }

  private init(externalConfiguration: ExternalYasguiConfiguration): void {
    if (!HtmlElementsUtil.getOntotextYasgui(this.hostElement) || !externalConfiguration) {
      return;
    }
    this.destroy();
    // @ts-ignore
    if (window.Yasgui) {
      this.translationService.setLanguage(externalConfiguration.language);
      // * Build the internal yasgui configuration using the provided external configuration
      const yasguiConfiguration = this.yasguiConfigurationBuilder.build(externalConfiguration);
      // * Build a yasgui instance using the configuration
      YasrService.registerPlugin(PivotTablePlugin.PLUGIN_NAME, PivotTablePlugin as any);
      YasrService.registerPlugin(ChartsPlugin.PLUGIN_NAME, ChartsPlugin as any);
      this.ontotextYasgui = this.yasguiBuilder.build(this.hostElement, yasguiConfiguration);
      this.afterInit();
    }
  }

  componentWillLoad(): void {
    // @ts-ignore
    if (!window.Yasgui) {
      // Load the yasgui script once.
      YASGUI_MIN_SCRIPT();
    }
    this.translationService.setLanguage(this.language);
  }

  componentDidLoad(): void {
    // As documentation said "The @Watch() decorator does not fire when a component initially loads."
    // yasgui instance will not be created if we set configuration when component is loaded, which
    // will be most case of the component usage. So we call the method manually when component is
    // loaded. More info https://github.com/TriplyDB/Yasgui/issues/143
    this.init(this.config);
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  render() {
    const classList = `yasgui-host-element ${this.getOrientationMode()} ${this.getRenderMode()}`;
    return (
      <Host class={classList}>
        <div class="yasgui-toolbar hidden">
          <button class="yasgui-btn btn-mode-yasqe"
                  onClick={() => this.changeRenderingMode(RenderingMode.YASQE)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasqe.btn.label')}
          </button>
          <button class="yasgui-btn btn-mode-yasgui"
                  onClick={() => this.changeRenderingMode(RenderingMode.YASGUI)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasgui.btn.label')}
          </button>
          <button class="yasgui-btn btn-mode-yasr"
                  onClick={() => this.changeRenderingMode(RenderingMode.YASR)}>
            {this.translationService.translate('yasgui.toolbar.mode_yasr.btn.label')}
          </button>
          <yasgui-tooltip
            data-tooltip={this.resolveOrientationButtonTooltip()}
            placement="left"
            show-on-click={true}>
            <button class="btn-orientation icon-columns red"
                    onClick={() => this.changeOrientation()}>&nbsp;</button>
          </yasgui-tooltip>
        </div>
        <div class="ontotext-yasgui"></div>

        {this.showSaveQueryDialog &&
          <save-query-dialog data={this.getSaveQueryData()}
                             serviceFactory={this.serviceFactory}>&nbsp;</save-query-dialog>}

        {this.showSavedQueriesPopup &&
          <saved-queries-popup config={this.getSaveQueriesData()}></saved-queries-popup>}

        {this.showConfirmationDialog &&
          <confirmation-dialog translationService={this.translationService}
                               config={this.getDeleteQueryConfirmationConfig()}></confirmation-dialog>}

        {this.showShareQueryDialog &&
          <share-query-dialog serviceFactory={this.serviceFactory}
                              config={this.getShareLinkDialogConfig()}></share-query-dialog>}
        {this.showCopyResourceLinkDialog &&
          <copy-resource-link-dialog serviceFactory={this.serviceFactory}
                                     resourceLink={this.copiedResourceLink}>
          </copy-resource-link-dialog>}
      </Host>
    );
  }
}
