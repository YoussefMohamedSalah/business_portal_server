import { UserSubscriber } from "./UserSubscriber";
import { PurchaseOrderSubscriber } from "./PurchaseOrderSubscriber";
import { SiteSubscriber } from "./SiteSubscriber";
import { MaterialSubscriber } from "./MaterialSubscriber";
import { PettyCashSubscriber } from "./PettyCashSubscriber";
import { ProjectSubscriber } from './ProjectSubscriber';
import { GroupSubscriber } from './GroupSubscriber';


export const subscribers = [
    PurchaseOrderSubscriber,
    SiteSubscriber,
    MaterialSubscriber,
    PettyCashSubscriber,

    UserSubscriber,
    ProjectSubscriber,
    GroupSubscriber
];