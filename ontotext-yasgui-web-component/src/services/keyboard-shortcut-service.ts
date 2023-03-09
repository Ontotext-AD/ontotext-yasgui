import {KeyboardShortcutDescription, KeyboardShortcutName} from '../models/keyboard-shortcut-description';

export class KeyboardShortcutService {
  static initKeyboardShortcutMapping = (): KeyboardShortcutDescription[] => {
    const keyboardShortcutDescriptions = [];
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createTriggerAutocomplete());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createDeleteCurrentLine());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCommentCurrentLine());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCopyLineDown());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCopyLineUp());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createAutoFormat());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createIndentMore());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createIndentLess());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createExecuteQuery());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createExecuteExplainPlanForQuery());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCreateTab());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createSavedQuery());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createSwitchToNextTab());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createSwitchToPreviousTab());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createCloseAllTabs());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createF11());
    keyboardShortcutDescriptions.push(KeyboardShortcutService.createEscape());
    return keyboardShortcutDescriptions;
  };

  private static createTriggerAutocomplete(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.TRIGGER_AUTOCOMPLETION;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Space');
    keyboardShortcut.keyboardShortcuts.push('Alt-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Space');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('TRIGGER_AUTOCOMPLETION not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createDeleteCurrentLine(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.DELETE_CURRENT_LINE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-D');
    keyboardShortcut.keyboardShortcuts.push('Ctrl-K');
    keyboardShortcut.keyboardShortcuts.push('Cmd-D');
    keyboardShortcut.keyboardShortcuts.push('Cmd-K');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('DELETE_CURRENT_LINE not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createCommentCurrentLine(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COMMENT_SELECTED_LINE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-/');
    keyboardShortcut.keyboardShortcuts.push('Cmd-/');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('COMMENT_SELECTED_LINE not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createCopyLineDown(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COPY_LINE_DOWN;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Down');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Down');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('COPY_LINE_DOWN not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createCopyLineUp(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.COPY_LINE_UP;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Up');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Up');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('COPY_LINE_UP not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createAutoFormat(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.AUTO_FORMAT_SELECTED_LINE;
    keyboardShortcut.keyboardShortcuts.push('Shift-Ctrl-F');
    keyboardShortcut.keyboardShortcuts.push('Shift-Cmd-F');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('AUTO_FORMAT_SELECTED_LINE not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createIndentMore(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.INDENT_CURRENT_LINE_MORE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-]');
    keyboardShortcut.keyboardShortcuts.push('Cmd-]');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('INDENT_CURRENT_LINE_MORE not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createIndentLess(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.INDENT_CURRENT_LINE_LESS;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-[');
    keyboardShortcut.keyboardShortcuts.push('Cmd-[');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('INDENT_CURRENT_LINE_LESS not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createExecuteQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_QUERY_OR_UPDATE;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Enter');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Enter');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('EXECUTE_QUERY_OR_UPDATE not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createExecuteExplainPlanForQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.EXECUTE_EXPLAIN_PLAN_FOR_QUERY;
    keyboardShortcut.keyboardShortcuts.push('Shift-Ctrl-Enter');
    keyboardShortcut.keyboardShortcuts.push('Shift-Cmd-Enter');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('EXECUTE_EXPLAIN_PLAN_FOR_QUERY not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createCreateTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CREATE_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-T');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-T');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('CREATE_TAB not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createSavedQuery(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CREATE_SAVE_QUERY;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-S');
    keyboardShortcut.keyboardShortcuts.push('Cmd-S');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('CREATE_SAVE_QUERY not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createSwitchToNextTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.SWITCH_NEXT_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Right');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Right');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('SWITCH_NEXT_TAB not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createSwitchToPreviousTab(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.SWITCH_PREVIOUS_TAB;
    keyboardShortcut.keyboardShortcuts.push('Ctrl-Alt-Left');
    keyboardShortcut.keyboardShortcuts.push('Cmd-Alt-Left');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('SWITCH_PREVIOUS_TAB not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createCloseAllTabs(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.CLOSES_ALL_TABS;
    keyboardShortcut.keyboardShortcuts.push('Shift-Left-Mouse');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('CLOSES_ALL_TABS not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createF11(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.F11;
    keyboardShortcut.keyboardShortcuts.push('F11');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('F11 not implemented yet');
    };
    return keyboardShortcut;
  }

  private static createEscape(): KeyboardShortcutDescription {
    const keyboardShortcut = new KeyboardShortcutDescription()
    keyboardShortcut.NAME = KeyboardShortcutName.ESC;
    keyboardShortcut.keyboardShortcuts.push('Esc');
    //@ts-ignore
    keyboardShortcut.executeFunction = (_yasqe: Yasqe) => {
      // TODO implement query
      console.log('ESC not implemented yet');
    };
    return keyboardShortcut;
  }
}
