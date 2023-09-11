import { UserSubscriber } from "./UserSubscriber";
import { PurchaseOrderSubscriber } from "./PurchaseOrderSubscriber";
import { SiteSubscriber } from "./SiteSubscriber";
import { MaterialSubscriber } from "./MaterialSubscriber";
import { PettyCashSubscriber } from "./PettyCashSubscriber";


export const subscribers = [
    UserSubscriber,
    PurchaseOrderSubscriber,
    SiteSubscriber,
    MaterialSubscriber,
    PettyCashSubscriber
];