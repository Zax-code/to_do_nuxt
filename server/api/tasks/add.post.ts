import prisma from '../../prisma';
import Task from "types/task";

export default eventHandler(async (event) => {
    const receivedTask = await readBody(event) as Task;
    try{
        await prisma.task.create({
            data : receivedTask
        })
        return { success: true, error: ""};
    }
    catch(error : any){
        return { success: false, error : error.toString() as string};
    }
});