// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const START_DIALOG = "START_DIALOG";

const { haveDialog, HAVE_DIALOG } = require('./haveDialog');
const { nothingDialog, NOTHING_DIALOG } = require('./nothingDialog');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class startDialog extends ComponentDialog {
    constructor(userState) {
        super('START_DIALOG');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new haveDialog());
        this.addDialog(new nothingDialog());

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.transportStep.bind(this),
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

    async transportStep(step) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the users response is received.
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Do you have Nintendo Switch?',
            choices: ChoiceFactory.toChoices(['Yes!', 'No...'])
        });
    }


    async summaryStep(step) {
        if(step.result.value.includes("Yes")){
            return await step.beginDialog(HAVE_DIALOG);
        }else if(step.result.value.includes("No")){
            return await step.beginDialog(NOTHING_DIALOG);
        }
    }

}

module.exports.startDialog = startDialog;
module.exports.START_DIALOG = START_DIALOG;