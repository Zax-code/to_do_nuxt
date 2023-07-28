import prisma from '../../prisma';

export default eventHandler(async (event) => {
    const {oldIndex,oldIndexId, newIndex, newIndexId} = await readBody<{oldIndex : number, oldIndexId : string, newIndex : number, newIndexId : string}>(event);
    try{
        await prisma.task.update({
            where : {id : oldIndexId},
            data : {index : newIndex, lastUpdate : new Date(Date.now()) }
        })

        await prisma.task.update({
            where : {id : newIndexId},
            data : {index : oldIndex }
        })
        return { success: true, error: ""};
    }
    catch(error : any){
        console.log(error);
        return { success: false, error : error.toString() as string};
    }
});