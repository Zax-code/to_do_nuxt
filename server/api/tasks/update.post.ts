import prisma from "../../prisma";
import Task from "types/task";

export default eventHandler(async (event) => {
    const receivedTask = await readBody(event) as Task;
    receivedTask.lastUpdate = new Date(Date.now());
    console.log(receivedTask);
    try{
        prisma.task.update({
            where: {id : receivedTask.id},
            data : receivedTask
        })
        return {success: true, error : "Task not found"}
    }
    catch(error : any){
        return { success: false, error : error.toString() as string};
    }
});