import { Request, Response } from 'express';
import { getById, getByCompanyId } from '../repositories/WorkflowRepository';


// DONE
export const getAllWorkFlow = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const companyWithWorkFlow = await getByCompanyId(companyId)
    if (!companyWithWorkFlow || !companyWithWorkFlow.workFlow) {
        return res.json({ msg: "WorkFlow Is not found" });
    }
    let workFlow = companyWithWorkFlow.workFlow;
    return res.json(workFlow);
};


export const updateWorkFlow = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { site_request_flow, petty_cash_request_flow, material_request_flow, purchase_order_flow } = req.body;

    const company = await getByCompanyId(companyId)
    if (!company || !company.workFlow) return res.json({ msg: "Company Is not found" });

    const workflow = await getById(company.workFlow.id)
    if (!workflow) return res.json({ msg: "Workflow Is not found" });

    if (site_request_flow) workflow.site_request_flow = site_request_flow;

    if (petty_cash_request_flow) workflow.petty_cash_request_flow = petty_cash_request_flow;

    if (material_request_flow) workflow.material_request_flow = material_request_flow;

    if (purchase_order_flow) workflow.purchase_order_flow = purchase_order_flow;

    await workflow.save()
    return res.json(workflow);
};