export declare const NotificationService: {
    create(data: {
        userId: string;
        userEmail: string;
        type: string;
        message: string;
        taskId?: string;
    }): Promise<any>;
    list(userId: string): any;
    markRead(userId: string): Promise<any>;
};
//# sourceMappingURL=notificationController.d.ts.map