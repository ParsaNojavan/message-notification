export default abstract class MessageService {
    abstract sendOtp(recipient: string, code: string, metadata?: Record<string, any>): Promise<void>;
}