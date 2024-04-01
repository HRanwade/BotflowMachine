import { Snapshot, assign, createActor, createMachine } from "xstate";


// tHink of this as server route handler
export function handleRequest(textInput: string) {

    // 1. create a bot flow state machine
    // it defines the flow of conversation
    // we decided to not provide a visual deisgner, so we create it manually
    const botflowMachine = createMachine({
        id: "botflow",
        initial: "start",
        context: { name: "" },
        states: {
            start: {
                on: {
                    next: "greetUser"
                }
            },
            greetUser: {
                entry: (e) => {
                    console.log({ e });

                    sendMessageToUser("Hi, user. welcome to chatbot")
                },
                on: {
                    next: "promptName"
                }
            },
            promptName: {
                entry: () => {
                    sendMessageToUser("Whats your name ?")
                },
                tags: ["promptUser"],
                on: {
                    next: "waitingForName"
                }
            },
            waitingForName: {
                on: {
                    next: "processName",

                }
            },
            processName: {
                entry: assign({
                    name: ({ event }) => event.payload.utterance,
                }),
                on: {
                    next: "showMenu"
                }
            },
            showMenu: {
                entry: (e) => {
                    sendMessageToUser(`Hi,${e.context.name}, Im the bot `)
                    sendMessageToUser(`How can I help you ? `)
                },
                tags: ["promptUser"],
                on: {
                    next: "waitingForRecognizeIntent"
                },
            },
            waitingForRecognizeIntent: {
                on: {
                    next: "recognizeIntent",
                }
            },
            recognizeIntent: {
                entry: (e) => {
                    sendMessageToUser(`Let me check`);
                    console.error(e)
                },
            }
        },
    });


    // 2. we create an actor
    // state machine can act as an actor
    const botflowActor = createActor(botflowMachine, {
        //restore if there is any existing paused machine ?
        snapshot: getPersistedMachineIfExists()
    });

    // 3. we log for debug
    botflowActor.subscribe(console.warn)

    //4. update ui to show current state name
    botflowActor.subscribe(e => renderStateName(e.value as string))

    // 5. we start the actor
    botflowActor.start();
    botflowActor.send({ type: "next", payload: { utterance: textInput || "" } });


    // 6. we want machine to continue until it cant move further
    // for ex when user input is required
    // here we added tags to identify such states
    while (!botflowActor.getSnapshot().hasTag("promptUser") && botflowActor.getSnapshot().can({ type: "next" })) {
        console.log("next step");
        botflowActor.send({ type: "next" });
    }

    // 6.4 on purpose move it next so that it reaches waitingForName state
    botflowActor.send({ type: "next" });
    console.log("force next");




    // 7. we the save the current state to json
    // so that later we can restore it and conversation continues from where it left off
    // right now ,we're using browser storage , but this code will run on server so db will be used
    saveMachine();





    console.log("end");

    function saveMachine() {
        const serializedBotFlow = botflowActor.getPersistedSnapshot();
        sessionStorage.setItem("bf", JSON.stringify(serializedBotFlow));
    }
}


// append the message to UI
// these will be calls to send message to ws clients
function sendMessageToUser(msg: string) {
    console.log("sending message to user");
    const p = document.createElement("p");
    p.style.textAlign = "left"
    p.innerHTML = `Bot says : ${msg}`;
    document.getElementById("messages")!.append(p);
}

// show state name to UI
function renderStateName(name: string) {
    document.getElementById("state")!.innerHTML = name;
}


function getPersistedMachineIfExists(): Snapshot<unknown> | undefined {
    try {
        return JSON.parse(sessionStorage.getItem("bf") || "")
    } catch (error) {
        return undefined;
    }
}

