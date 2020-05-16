// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

const NOTHING_DIALOG = "NOTHING_DIALOG";

class nothingDialog extends ComponentDialog {
    constructor() {
        super('NOTHING_DIALOG');
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async summaryStep(step) {
        let msg = `Oh...U cannot play Doumori....`;
        await step.context.sendActivity(msg);
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is the end.
        return await step.endDialog();
    }
}

module.exports.nothingDialog = nothingDialog;
module.exports.NOTHING_DIALOG = NOTHING_DIALOG;