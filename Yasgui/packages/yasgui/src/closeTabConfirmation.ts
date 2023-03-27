import { TranslationService } from "@triply/yasgui-utils";

export class CloseTabConfirmation {
    private confirmationDialog: any;
    private boundRejectHandler: Function;
    private boundConfirmationHandler: Function;

    constructor(public translationService: TranslationService,
                public confirmationTitle: string,
                public confirmationMessage: string,
                public onConfirm: Function) {
        this.init();
        this.boundRejectHandler = this.rejectedhandler.bind(this);
        this.boundConfirmationHandler = this.confirmationHandler.bind(this);
    }

    open() {
        this.confirmationDialog.addEventListener("internalConfirmationRejectedEvent", this.boundRejectHandler);
        this.confirmationDialog.addEventListener("internalConfirmationApprovedEvent", this.boundConfirmationHandler);
        document.body.appendChild(this.confirmationDialog);
    }

    private init() {
        this.confirmationDialog = document.createElement("confirmation-dialog");
        this.confirmationDialog.translationService = this.translationService;
        this.confirmationDialog.config = {
            title: this.confirmationTitle,
            message: this.confirmationMessage
        };
    }

    private rejectedhandler() {
        this.closeConfirmation();
    };

    private confirmationHandler() {
        this.closeConfirmation();
        this.onConfirm();
    };

    private closeConfirmation() {
        document.body.removeChild(this.confirmationDialog);
        this.confirmationDialog.removeEventListener('internalConfirmationRejectedEvent', this.boundRejectHandler);
        this.confirmationDialog.removeEventListener('internalConfirmationApprovedEvent', this.boundConfirmationHandler);
        this.confirmationDialog = null;
    }
}
