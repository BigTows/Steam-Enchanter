import StreamApiException from "./StreamApiException";

class NeedConfirmationStreamApiException extends StreamApiException {

    readonly confirmationId: string;

    constructor(confirmationId: string) {
        super(`You need to confirm your order (${confirmationId}).`);
        this.confirmationId = confirmationId;
    }
}

export default NeedConfirmationStreamApiException;