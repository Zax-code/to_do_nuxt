<script setup lang="ts">
import Task from "types/task";
import { Sortable as SortableList } from "sortablejs-vue3";
import Sortable from "sortablejs";

const STATUS_COLORS = {
    OPEN: "text-red-500",
    "IN PROGRESS": "text-yellow-500",
    DONE: "text-green-500",
};

const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const { data: tasks, refresh: refreshTasks, pending: taskPending } = await useFetch<Task[]>('/api/tasks', {
    method: 'GET',
});
const message_list = useState<{message : string, id : number}[]>(() => []);
const pushMessage = (message : string) => {
    const randomId = Math.floor(Math.random() * 1000000);
    message_list.value.push({message, id : randomId});
    setTimeout(() => {
        message_list.value.shift();
    }, 2000);
}

const currentTask = useState<Task>(() =>
({
    title: "",
    description: "",
    status: "OPEN",
    index : -1,
    createdAt : new Date(Date.now()),
    lastUpdate : new Date(Date.now()),
} as Task)
);

const addTask = async (e: any) => {
    e.preventDefault();
    if(currentTask.value.title === "" || currentTask.value.description === "")
        return pushMessage('Veuillez remplir tous les champs !');
    currentTask.value.index = tasks.value?.length || 0;
    const { success, error } = await $fetch('/api/tasks/add', {
        method: 'POST',
        body: currentTask.value
    })
    if (success) {
        refreshTasks();
        currentTask.value = {
            title: "",
            description: "",
            status: "OPEN",
            index : -1,
            createdAt : new Date(Date.now()),
            lastUpdate : new Date(Date.now()),

        };
        pushMessage('Tache ajoutee avec succes !');
    }
    else
        pushMessage(`Erreur when adding a new task : ${error}`);
};

const nextStatus = async (task: Task) => {
    const status = task.status;
    if (status === "OPEN")
        task.status = "IN PROGRESS";
    else if (status === "IN PROGRESS")
        task.status = "DONE";
    else
        task.status = "OPEN";
    const { success, error } = await $fetch('/api/tasks/update', {
        method: 'POST',
        body: task
    })
    if (success) {
        console.log("Task updated");
        refreshTasks();
    }
    else
        pushMessage(`Erreur when updating task : ${error}`);

};

const reorderTasks = async (e: Sortable.SortableEvent) => {
    const oldIndex = e.oldIndex || 0;
    const newIndex = e.newIndex || 0;
    const oldIndexId = tasks.value ? tasks.value[oldIndex].id : '';
    const newIndexId = tasks.value ? tasks.value[newIndex].id : '';

    const { success, error } = await $fetch('/api/tasks/reorder', {
        method: 'POST',
        body: { oldIndex, newIndex, oldIndexId, newIndexId }
    })

    if (success) {
        refreshTasks();
        pushMessage('Taches reorganisees avec succes !');
    }
    else
        pushMessage(`Erreur when reordering task : ${error}`);

};

const removeTask = async (id : string | undefined) => {
    console.log(`removing ${id}`);
    const { success, error } = await $fetch('/api/tasks', {
        method: 'DELETE',
        params: {
            id
        }
    })
    if (success) {
        console.log("Task deleted");
        refreshTasks();
        pushMessage('Tache supprimee avec succes !');
    }
    else {
        refreshTasks();
        pushMessage(`Erreur deleting task : ${error}`);
    }
};
</script>

<template>
    <div class="flex flex-col items-center">
            <TransitionGroup name="list" tag="div" class="fixed right-2 top-2 flex flex-col gap-2 z-10  w-1/5">
            <div v-for="{message, id} in message_list" :key="id"
                :class="`rounded-lg p-4 ${message.includes('Erreur') ? 'bg-red-500' : 'bg-green-500'} transition duration-500 w-full`">
                <p class="text-center">{{ message }}</p>
            </div>
        </TransitionGroup>
        <h1 class="text-5xl font-bold w-full text-center ">My To Do List</h1>
        <button class="rounded-lg py-2 px-6 m-4  bg-red-950 hover:bg-red-900 hover:text-slate-50 text-lg absolute left-0 top-0" @click="client.auth.signOut()">Logout</button>
        <form class="flex flex-col items-center p-12 w-2/5" @submit="addTask">
            <input class="rounded-lg p-2 m-2 w-full text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-800"
                type="text" v-model="currentTask.title" placeholder="Add a task title" id="taskTitle" />
            <textarea class="rounded-lg p-2 m-2 w-full h-40 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-800"
                v-model="currentTask.description" placeholder="Add a task description" id="taskDescription"></textarea>

            <button type="submit" class="rounded-lg p-2 m-2 w-full bg-slate-800 hover:bg-slate-700 hover:text-slate-50">Add
                Task</button>
        </form>
        <SortableList :options="{ghostClass : 'cursor-pointer', chosenClass: 'cursor-pointer', dragClass : 'cursor-pointer'}" class="flex flex-col items-center w-2/5 p-12" :list="tasks || []" item-key="id" @end="reorderTasks">
            <template #item="{ element: task } : { element: Task }">
                <div class="bg-slate-800 hover:bg-slate-700 hover:cursor-pointer rounded m-2 w-full flex flex-col gap-4 px-6 py-4 relative">
                    <button
                        class="text-xs font-bold select-none rounded hover:bg-red-800 right-0 top-0 absolute p-3"
                        @click="removeTask(task.id)">X</button>
                    <h2 class="text-2xl font-bold capitalize text-center">{{ task.title }}</h2>
                    <p class="text-base mt-4">{{ task.description }} {{ task.id }}</p>
                    <p :class=" `text-xs text-end select-none ${STATUS_COLORS[task.status]}` " @click="nextStatus(task)">{{
                        task.status }}</p>
                </div>
            </template>
        </SortableList>

    </div>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-100%)
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>