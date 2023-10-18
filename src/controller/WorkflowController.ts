import { Request, Response } from 'express';
import { getById, getByCompanyId } from '../repositories/WorkflowRepository';
import { RequestType } from '../enums/enums';
import { Company } from '../entities/Company';
import { getAllCompany_pending_MaterialReq, getAllCompany_pending_PcReq, getAllCompany_pending_PoReq, getAllCompany_pending_SiteReq } from '../repositories/RequestsRepository';


export interface RequestWorkFlow {
    userId: string,
    title: string,
    state: boolean,
    isRejected: boolean
}

// DONE
export const getAllWorkFlow = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const companyWithWorkFlow = await getByCompanyId(companyId)
    if (!companyWithWorkFlow || !companyWithWorkFlow.workFlow) {
        return res.status(404).json({ msg: "WorkFlow Is not found" });
    }
    let workFlow = companyWithWorkFlow.workFlow;
    return res.status(200).json(workFlow);
};


export const updateWorkFlow = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { site_request_flow, petty_cash_request_flow, material_request_flow, purchase_order_flow } = req.body;
    console.log(req.body)
    const company = await getByCompanyId(companyId)
    if (!company || !company.workFlow) return res.status(404).json({ msg: "Company Is not found" });

    const workflow = await getById(company.workFlow.id)
    if (!workflow) return res.status(404).json({ msg: "Workflow Is not found" });


    let pendingRequestsArray: any[] = [];

    if (site_request_flow) {
        workflow.site_request_flow = site_request_flow;
        let term = RequestType.SITE;
        let value: RequestWorkFlow = site_request_flow;
        let pendingRequests = await getAllPendingRequests(term, companyId)
        if (pendingRequests) {
            handleRequestsAfterWorkFlowChange(pendingRequests, site_request_flow)
        }
    }

    if (petty_cash_request_flow) {
        workflow.petty_cash_request_flow = petty_cash_request_flow;
        let term = RequestType.PETTY_CASH;
        let value: RequestWorkFlow = petty_cash_request_flow;
        let pendingRequests = await getAllPendingRequests(term, companyId)
        if (pendingRequests) {
            handleRequestsAfterWorkFlowChange(pendingRequests, petty_cash_request_flow)
        }
    }

    if (material_request_flow) {
        workflow.material_request_flow = material_request_flow;
        let term = RequestType.MATERIAL;
        let value: RequestWorkFlow = material_request_flow;
        let pendingRequests = await getAllPendingRequests(term, companyId)
        if (pendingRequests) {
            handleRequestsAfterWorkFlowChange(pendingRequests, material_request_flow)
        }

    }
    if (purchase_order_flow) {
        workflow.purchase_order_flow = purchase_order_flow;
        let term = RequestType.PURCHASE_ORDER;
        let value: RequestWorkFlow = purchase_order_flow;
        let pendingRequests = await getAllPendingRequests(term, companyId)
        if (pendingRequests.length > 0) {
            handleRequestsAfterWorkFlowChange(pendingRequests, purchase_order_flow)
        }
    }
    await workflow.save()
    return res.status(200).json(workflow);
};


const getAllPendingRequests = async (term: string, companyId: string) => {
    // first get all requests with the same type
    let pendingRequestsArray: any[] = [];
    if (term === RequestType.PURCHASE_ORDER) {
        let requests = await getAllCompany_pending_PoReq(companyId)
        pendingRequestsArray = requests ? requests : [];
    } else if (term === RequestType.PETTY_CASH) {
        let requests = await getAllCompany_pending_PcReq(companyId)
        pendingRequestsArray = requests ? requests : [];
    } else if (term === RequestType.MATERIAL) {
        let requests = await getAllCompany_pending_MaterialReq(companyId)
        pendingRequestsArray = requests ? requests : [];
    } else if (term === RequestType.SITE) {
        let requests = await getAllCompany_pending_SiteReq(companyId)
        pendingRequestsArray = requests ? requests : [];
    }
    return pendingRequestsArray;
};


const handleRequestsAfterWorkFlowChange = async (requestsArr: any, workFlowArr: any) => {
    let requestWorkflowIds = [];
    let filteredWorkflowArr = [];

    for (let index = 0; index < requestsArr.length; index++) {
        const itemId = requestsArr[index].id;
        requestWorkflowIds.push(itemId)
    }

    for (let index = 0; index < workFlowArr.length; index++) {
        const item = workFlowArr[index];
        let isExists = requestWorkflowIds.indexOf(item.id)
        if (isExists) filteredWorkflowArr.unshift(item)
    }
    console.log(requestWorkflowIds)
    console.log(filteredWorkflowArr)
    // !check this
};