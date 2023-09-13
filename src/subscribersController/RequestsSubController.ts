import { createNotification } from "../repositories/NotificationRepository";

// DONE
export const handleRequestNotification = async (term: string, value: any) => {
    if (term === 'PurchaseOrderRequest') {
        let title = "New Purchase Order Request";
        let content = `New Purchase Order Request Just Created By ${value.user?.name!} with Subject of ${value.subject!}. Please Check It Out.`;
        requestNotification(title, content, value);
    } else if (term === 'MaterialRequest') {
        let title = "New Material Request";
        let content = `New Material Request Just Created By ${value.user?.name!} with Subject of ${value.subject!}. Please Check It Out.`;
        requestNotification(title, content, value);
    } else if (term === 'SiteRequest') {
        let title = "New Site Request";
        let content = `New Site Request Just Created By ${value.user?.name!} with Subject of ${value.subject!}. Please Check It Out.`;
        requestNotification(title, content, value);
    } else if (term === 'PettyCashRequest') {
        let title = "New Petty Cash Request";
        let content = `New Petty Cash Request Just Created By ${value.user?.name!} with Subject of ${value.subject!}. Please Check It Out.`;
        requestNotification(title, content, value);
    }
};

export const requestNotification = async (title: string, content: string, value: any) => {
    if (value.work_flow.length === 0) return;
    for (let i = 0; i < value.work_flow.length; i++) {
        let userId = value.work_flow[i].userId;
        await createNotification(title, content, userId);
    }
};