import prisma from "../../prisma";
import Task from "types/task";

export default eventHandler(async (event) => {
    const receivedTask = await readBody(event) as Task;
    receivedTask.lastUpdate = new Date(Date.now());
    console.log(receivedTask);
    try{
        prisma.task.update({
            where: {id : receivedTask.id},
            data : {
                title : receivedTask.title,
                description : receivedTask.description,
                lastUpdate : receivedTask.lastUpdate,
                index : receivedTask.index,
                status : receivedTask.status,
            }
        })
        return {success: true, error : ""}
    }
    catch(error : any){
        return { success: false, error : error.toString() as string};
    }
});