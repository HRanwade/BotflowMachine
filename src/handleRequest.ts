import { Snapshot, assign, createActor, createMachine, fromPromise, raise, setup } from "xstate";


// tHink of this as server route handler
export function handleRequest(textInput: string) {

  // 1. create a bot flow state machine
  // it defines the flow of conversation
  // we decided to not provide a visual deisgner, so we create it manually
  const fetchUser = async (inputFromUser: string) => true;

  const botflowMachine =
    setup({
      types: {
        context: {} as {
          msg: string;
          inputService: string;
          inputServiceNumber: string;
          queryByUser: string;
          CSRDetails: string,
          inputFAQAction: string,
          inputSelectedQuery: string,
          inputPutQuery: string
        },
        //     events: {} as
        //       | { type: "next" }
        //       | { type: "error" }
        //       | { type: "endChat" }
        //       | { type: "reStart" }
        //       | { type: "success" }
        //       | { type: "mainMenu" }
        //       | { type: "selectQuery" }
        //       | { type: "backToFaqMenu" }
        //       | { type: "putQueryInTextBox" }
        //       | { type: "reEnterServiceRequestNumber" }
        //       | { type: "CS" }
        //       | { type: "CSR" }
        //       | { type: "FAQ" }
        //       | { type: "CRS" }
        //       | { type: "next3" },
      },
      actions: {
        sendMessageToUser: (_, params: { msg: string }) => {
          console.log("sending message to user");
          const p = document.createElement("p");
          p.style.textAlign = "left"
          p.innerHTML = `Bot says : ${params.msg}`;
          document.getElementById("messages")!.append(p);

        },

        actionForService: raise((e) => {
          switch (e.context.inputService) {
            case "CS":
              return { type: 'CS', data: 'someData' };
            case "CRS":
              return { type: 'CRS', data: 'someData' };
            case "CSR":
              return { type: 'CSR', data: 'someData' };
            default:
              return { type: 'FAQ', data: 'someData' };
          }
        }),
        FAQAction: raise((e) => {
          if (e.context.inputFAQAction === "SELECT") {
            return { type: 'goToSelect', data: 'someData' };
          }
          else {
            return { type: 'goToPUT', data: 'someData' };
          }
        }),
        actionForSelectedQuery: raise((e) => {
          if (e.context.inputFAQAction === "1") {
            return { type: 'goToQuery1', data: 'someData' };
          }
          else {
            return { type: 'goToQuery2', data: 'someData' };
          }
        }),

      },
      actors: {
        fetchService: fromPromise(async ({ input }: { input: { inputService?: string } }) => {
          const user = await fetchUser(input?.inputService || ''); // Default to an empty string if input.name is undefined
          return user;
        }),
        CheckServiceStatus: fromPromise(async ({ input }: { input: { inputServiceNumber?: string } }) => {
          const user = await fetchUser(input?.inputServiceNumber || ''); // Default to an empty string if input.name is undefined
          return user;
        }),
        fetchFAQAction: fromPromise(async ({ input }: { input: { inputFAQAction?: string } }) => {
          const user = await fetchUser(input?.inputFAQAction || ''); // Default to an empty string if input.name is undefined
          return user;
        }),
        fetchSelectedQuery: fromPromise(async ({ input }: { input: { inputSelectedQuery?: string } }) => {
          const user = await fetchUser(input?.inputSelectedQuery || ''); // Default to an empty string if input.name is undefined
          return user;
        }),
      },
      schemas: {
        events: {
          "": {
            type: "object",
            properties: {},
          },
          next: {
            type: "object",
            properties: {},
          },
          error: {
            type: "object",
            properties: {},
          },
          endChat: {
            type: "object",
            properties: {},
          },
          reStart: {
            type: "object",
            properties: {},
          },
          success: {
            type: "object",
            properties: {},
          },
          mainMenu: {
            type: "object",
            properties: {},
          },
          selectQuery: {
            type: "object",
            properties: {},
          },
          backToFaqMenu: {
            type: "object",
            properties: {},
          },
          putQueryInTextBox: {
            type: "object",
            properties: {},
          },
          reEnterServiceRequestNumber: {
            type: "object",
            properties: {},
          },
          CS: {
            type: "object",
            properties: {},
          },
          CSR: {
            type: "object",
            properties: {},
          },
          FAQ: {
            type: "object",
            properties: {},
          },
          CRS: {
            type: "object",
            properties: {},
          },
          next3: {
            type: "object",
            properties: {},
          },
        },
        context: {
          msg: {
            type: "string",
            description: "",
          },
          inputService: {
            type: "string",
            description: "",
          },
          inputServiceNumber: {
            type: "string",
            description: "",
          },
          queryByUser: {
            type: "string",
            description: "",
          },
          CSRDetails: {
            type: "string",
            description: "",
          },
          inputFAQAction: {
            type: "string",
            description: "",
          },
          inputSelectedQuery: {
            type: "string",
            description: ""
          },
          inputPutQuery: {
            type: "string",
            description: ""
          }
        },
      },
    }).createMachine({
      /** @xstate-layout N4IgpgJg5mDOIC5QGEAWBDALgIwPaYFl0BjVASwDswA6WTdAJ0wGIqAPTAbQAYBdRUAAdcsMpjK4KAkG0QBGACwB2agE516pQoUAmAMzcAbHp0AaEAE9EADjnU5hw0u5y9AVm5LrSxwF9f5mhYeIQk5FTUUAxgYJgAqrBgDKxgHDz8SCDCouKS0rIIinp61IaKbnq6JtwKquZWCMVu1NZlOro6OhXW1jr+gRg4+ESklDSCDLgAtoLxiQwAYrgMAMpJAG5kxGApaXzS2WISUpkFbmaWiMUm1Oe93KrFCiZy-SBBQ6GjEQDu6EcUKBLBgASQoggArpg1gxNttdlx9plDrkTqACu5DPYanIesYKnIlHVLo1ijpbjp7o9Ki83h8QiNwuNJttYLBgWDIdCNlsduxERkhCIjnlTogdIZVHYiYSlG4lPp5cSGhUsaptIZuHpVNZztxKXTBgywmNqJgGGQoDBVoIwMQyAAzLYwuE7CCSGiUda4ADWNBg3NhvPSB2FqPyNlU3DUDkMblq7Tc8vq4p0clU9ncckp6u8qj6AXeRuGJoi5st1pWtvtTuILt5zCSkwY1EEABssA7llNIrF69sQ8iw8cIwh9CVuEZ1c45HI3Li5ymEAp0-Z1fLvEY3L1DcES98aOWrUkq3bHc6efDkCtB0KciOxaTyRKajpuPOFUolISl-oFNZqC-IlHA8JRtTcXdPkZU0j0ratzzrS8dmQAAlG8kTvEU0RkK4bhfXR30JHQvx-EkuhuMpXG0WwpW0CDC3pfcmTNC1jxtM9a37ZCVhQ28smHUV0SuTpqHwt8P2I78lF-bxmkojotUMTpikg40DxYisT3gzikOYBYAEEAEU+JRB8hLHCpqEnSVlBcOcFzcJcihUST1ScONbFsVSmNNYgIToaYTwhQRhCYZgpn+CgCDACgIRMgTsIKb8AOsVRtwUQxlAqVQwN-SoAKA1QQM8cDvK+ZjSDtH0ULAABHCE4GhehMH88LIui2L4vvQScIsgxSkcHw9EMax9QcX9t2adMMu-OQam-AsBj3crfNQKqavqxqVma-zaFQXAfgABUmGZMGBLiADkISmbAkgRLqsNHb8Mwy7xanfLpPAUCbWhaVLZz0dN1BcJQyugiJKuIaq6oauhtqwXa-gBIFlku67buSfkHvDR85ueagaS8N9XHzBRHLI7csR6KVXCBqNCTB0saEh6HNrhnbYFbFk4FgLiNthpqEdge6MP47rEvkPRfvA7xtRMIaLgaLpfupgG6ZBxn1JZ-mto56gWfOpCrpuu73QiL1fWZtaofhlrYGxszesJHVRNsLNdQyrpvrIpwM2G2nWn-XFKk1irrdZgXbd2g3UaN9G7qbZZWw7TAuwYHsWaj+3RdMnqCmdgDKVcecPaU+MJq0NcMscTxnGUPRQ9W9aYd1oXqC9dA2zICA+ZbuhjYx5hogAUQoTATyQnX+-jhgHbz1MdBeows3XLROgr8kbKcWd5uzRuIeiLAwF7tmWAiygOrinOEtHQkpczeNcTjMCPJkuVSlnBThuUhuGOLFaD5gCPifAWtB6BhSxtfcWo54wAW4NYa4aUForm9krVKU1pyflnGUUGf9lrg2ZofceIDGp7QOsCKYItBRi0eo+HodgZYGBMN0EaMk0pVy-MRbBDM8FQSZvrIhx9J590wNQJGZ1UYQmwFMMQVDQzQNxtmFQ6YiSAwMP+aibCMHKCwQ4HhS0+Fa0ESQugXNcCsnZN2ORQ4FHmVcJXXoi9iJRhMOJLRHDdE4P3jQB06BarC3PlFGKV9qG5wloUXoWIQbDVqDXXEit5DPBcl+NyPhtwLm8dQXx-izGnWBIZBqDALDWMwjjcyZQFCATnO0LUbh1SKDkEuHwm9pwSjAvGWpmTsmc3EZQFGiwjL6WIKiEpNCym9SjHJawCh9RdC8BocmDRmmlFaU4dwMz3BdL8ZzCY5iebAgMoZIZIzIGhJvo+KWlT3z0zTNuSknRDBOQVNGN8rR4w5S9vRAxalmLdI0mxU8NYtiHOOccZgZtPQUG9H6Xscwkhz3Cd+SpRVJxy2InU9oTlNRTQqB9RUjxahbJybBLSHFgWDOGWCxOLZ2ydm7LChI8KoG0PKT4USzgEGdGrrOBJhRF7Rn9s4doo13xxiJZzEl7EgXEBBZSyQzAoC4AACq4DWG2O0Ap5Est6nKZ8OpKIuF0JKJ5TgCZlA8GUKWCpiLiv+XBMlMqKUjMVSqw6UIEWjkcFiYi8DXHcuzE5RQlTtAJn1A8JSChbWJHVcMgpSQLC5NmMCTaRSVVqo1aMsJt8HAvK6JKOaaUvbSRJOUckrRCTZWUAgvevCfmmj+dGjVcailiP+OIQE+TCkWDTWAGNLBTlavGfnHRok1lRhyrUMmTkyZlpwZWrwgNFpFnwfwhtvam1drMRY5txSB02O1QUfMGY3BbxzCuTo1hfxahcvmGoMTrWvFrT5CIa6+07rtUkQ2fbIA7vBR6duULLYMvmB63G7Q7CEh6GNbwqi9BOXzM+YaJ6XBu1GtYKN67Y2bslV+jVP6u2NgYM2ZOdL07AaZWc2xTtqhVNxVJF+K54PxgpJ5Bw5x-y-2+c+nx2zaCYcwO+nDsdv0QF-S63AO65CgbsTR78dHZQxMaWReBwbtBaHlO0R4hgMNvuw6xa0uHhn4fjQq5VEmu06Gk07ToKgPoAzaZSXoTleh2EokpIaqpbVch3WCJVqQhhsETRIhgPmKB+Y4AAIVwGwTN5y7GitKGTLwCp-yTiUw0bBVz7kct1CDL5y7DG-N495rtvn-N4EC70jtyxQvhYC7Fqj+cpYlAJG+Jo7g82BsylZbL8DcsVsyYkNkxwlVkCmGAXAUJbY0DoIwft-mrP5y-GoDQE6qjL15Z9agK5favUqDlXBXGAEzZ5iNsbE2pvNRm-tH40U2ToBgI2CgEAPiLcQMsuMSlMoVAqNoZU4p+ok0nO0AwSktSRqfcdvjw3JCjfG5NwW48yG3Z5g9nY0R4ZMDe4UFT9gvy12aSuYoS53DRmpiDOM2o5r0ULBQXAEA4DSEYsdwdjsCgAFpMUknZ80Vbj85pjQF-l5nBCwFzdZ-PZcvLbADScC4UnyW-CQ9F1EGIcKGAS-CbOfMahtyg61A8Qk6WriuB66o7BgM5qHYK3WiIuzTqMsWLHIM2xNejglEVQCUovwafcESGSIlrXIewVGTwmSqv9M5FNpCbvcbaFKCeiUXRcXFxJ9cHrVIni0mV-w3ZFiOTgmjy7sAsfzLUUApqMms4ejFEUCTxeWJrjzPnChr8mTJWAoQlxUvvVlB5UJFU6ZcYcryg8BDo7ou-IBXG6sYKoVMA94KDMl5MtaipW1OqX8yszUk06Ce-M5xMlT8wIFWfIVliiNgDdgAIrEf4bZLFn-n4vxA5f9BpWmTqR46hUEA7Jix6ybMQiGtCffhbWERLOF-ZcGoKyBBSoNMHMLMX8T2FZZQDKSDT-I-cOKeRHXaK-A6Y6aYJNZ3V0AeJIKAmdWAp4BA9fecCaecKyJMHoDFdQSocfG3bjfWbAiAvWCPQ2YvMgjXfdIdGwbMewT6bBd8c4Y3CybwAmf6WmDQDWHPLWbg0+LOLdHmExXA+AYQtneQVwKJScGoMmRwR4S9CmbrKQ0aNMPQQnLA5udQvWGOVYOOE2IQ0pfQwoZQDMOzGJXUL8RwCaKwpgsaOwiNBwqGHAjQ-An4FYCEYgCxKAlRCDQabQCtXVYtJWOMZofUUabMS1eUVwSIiOVuO2ADdYTububQwQ5InKVIpwdIuUTIiaWoFoS1TUV8Z4YXf+SfYxYRU+KA7UK5OA3QbMWgmQySckaaXVbeKMdDFQiqfo4vHAsXJgCg3QKg+A8Yx4OgsidBVAzhWaLxRY3yZY10VY2IihKAzKaMMCFFBA3Qd5GSOpHfYaSnd5dgkXMA843kVY8Rc6KRGRBfPQyXCdRgt8fMbwaZVFdxGyI47ha3b4oxIBYhAY0BPPfZbsZItMDMD2dMKWDcPXN+ckf2dAzKakIqI-X47YS4m7JVDACgH0WAO7WANHZImabbGUKMUwv8Eknfck2oYoKk04l9bZIYiURgm5OcXoRxR5EkYwDMeEowSUfff8LzE6YgkLLtIYyua5FwW5WUh5JpSU8taoJMKE+BW1Pg5YWVcZLNR8ZwFQOwucfUKUdoYieUpZYwDhNpdZcHDUvZNkA5J1R2B08ydQACSoPI+caobMf7BAe49ohpE9MCAo21DvbSclI5OVbCcM3vNlOTYiZQHlJBL0+QZwEoF+KWfMJSWgnTDdeNKA7wOwNUus+pC9JyEwPEnBBUX7WcCoBsrDeNILZNLtHtPtKAqUY9U9VKc9SkadAfPI54R4d8B4fUIcgTTdG07U+NCcjVHE84P6dMVUf8CUCwjLMmEoQVedatJdZEorHJRtYcltTEtkHdZI-fNQfQD45xSaadfqZc3QZgpMOwzcwTfTT9YTPDUTHU0ErXWZUSOZL2Es4aODZTN8FodMVKZ5OA9UcCzdFNCwOQDk5QHfOcaMtMtKeDdUDPLUOAjwDc0UnjJ8-jd9IiuwaIWAYQCgRITteNEi+C2+WoZof2CimZKixZcUeBCDNyaQnUbcBBAikcoinQZI9wXnVKbFZg9wC8iswGKuW9RMI1ZSltVS6gLinivimrCzDkrUNQLS98HS7cZzXEHffs9ckAjgqHV9RsltXxMgNsCEaIDk5wW4KWd-WWbQBcktNKFrIuVoEaQ1JS5irJYrKEWrcraLKAnwFQL-C0moEafNJyHEOinofQIkBBL43o1ddKrc+NMrDgCrUcmyhqsLfzKLAoTwyXWwTStKOpQq1oKUQNFcQyupRxLQJi0A9SP5ErNqurZqnczKpq7KoSxRNogwN8NfFwQ1X-QoBwSpO4H1ZgkGJEmqmauq5agLTQtkBa6LD8tauxZQLEXELQYfLcOWQNSkKuQOHLXMW1AKoKkKx63qSJKyR4HwSdc8nKJyHMHfJ00CBUBwLZQK4KkvEGjEHKLkoowkGZeUJSdChoFcACaaPXMCXQV6bTVKobUQWHc7BHabKArnDLESWMOUGDNKXEfC6m07Om+HS7I+NYkE7qxFTbDwGMXbEafbQIwbXmsLemgWpHWI1k9kjG8UMKz7LoBZQGHUQm6Sv2LPQGIORPHolddSGms7fmxHGgGKHuOW5s3oQfZo54CUBcLfP2VKeBKUbUTwQkKm-wIAA */
      context: {
        msg: "",
        inputService: "",
        inputServiceNumber: "",
        queryByUser: "",
        CSRDetails: "",
        inputFAQAction: "",
        inputSelectedQuery: "",
        inputPutQuery: ""
      },
      id: "ChatbotMachine",
      initial: "start",
      states: {
        start: {
          on: {
            next: {
              target: "greetUser",
            },
          },
        },
        greetUser: {
          on: {
            next: {
              target: "promptUserForService",
            },
          },
          entry: {
            type: "sendMessageToUser",
            params: {
              msg: "Hi User ,welcome to chatbot",
            },
          },
        },
        promptUserForService: {
          on: {
            next: {
              target: "waitingForInputService",
            },
          },
          tags: ["promptUser"],
          entry: {
            type: "sendMessageToUser",
            params: {
              msg: "Do you want help with any of these services?\n1.Create service request(CSR)\n2. Check request status(CRS)\n3.Customer support(CS)\n4.FAQs(FAQ)",
            },
          },
        },
        waitingForInputService: {
          on: {
            next: {
              target: "processForInputService",
            },
          },
        },
        processForInputService: {
          entry: assign({
            inputService: ({ event }) => event.payload.utterance,
          }),
          on: {
            next: {
              target: "triggerSpecificService",
            },
          },

        },
        triggerSpecificService: {
          on: {
            CS: {
              target: "customerSupport",
            },
            CRS: {
              target: "checkRequestStatus",
            },
            CSR: {
              target: "createServiceRequest",
            },
            FAQ: {
              target: "faqs",
            },
          },
          invoke: {
            id: "getService",
            src: "fetchService",
            input: ({ context: { inputService } }) => ({ inputService }),
            onDone: {
              actions: ["actionForService"]
            },
            onError: {
              target: "failure",
            },

          },
        },
        customerSupport: {
          initial: "showDetailsForSupport",
          on: {
            mainMenu: {
              target: "promptUserForService",
            },
          },
          //   after: {
          //     "30000": {
          //       target: "sessionTimeoutState",
          //     },
          //   },
          states: {
            showDetailsForSupport: {
              entry: {
                type: "sendMessageToUser",
                params: {
                  msg: '"Customer care number:XXXXXXXXXX\nMail ID : xxxx@sbi.com"',
                },
              },
            },
          },
        },
        checkRequestStatus: {
          initial: "showPromptForServiceNumber",
          on: {
            mainMenu: {
              target: "promptUserForService",
            },
          },
          //   after: {
          //     "30000": {
          //       target: "sessionTimeoutState",
          //     },
          //   },
          states: {

            showPromptForServiceNumber: {

              entry: [{
                type: "sendMessageToUser",
                params: {
                  msg: "Check request status",
                },
              },
              {
                type: "sendMessageToUser",
                params: {
                  msg: "Enter the Service Number",
                },
              }],
              on: {
                next: {
                  target: "waitingForServiceNumber",
                }
              },
              tags: ["promptUser"],

            },
            waitingForServiceNumber: {
              on: {
                next: {
                  target: "processServiceRequestStatus",
                },

              },
            },
            processServiceRequestStatus: {
              on: {
                next: {
                  target: "checkForServiceNumber",
                },
              },
              entry: assign({
                inputServiceNumber: ({ event }) => event.payload.utterance,
              }),
            },
            checkForServiceNumber: {
              invoke: {
                id: "checkStatus",
                input: ({ context: { inputServiceNumber } }) => ({ inputServiceNumber }),
                onDone: {
                  target: "showSuccess",
                },
                onError: {
                  target: "invalidServiceRequestNumber",
                },
                src: "CheckServiceStatus",
              },
            },
            showSuccess: {
              entry: {
                type: "sendMessageToUser",
                params: {
                  msg: '"Your request is processed successfully.\n"',
                },
              },
            },
            invalidServiceRequestNumber: {
              on: {
                reEnterServiceRequestNumber: {
                  target: "#ChatbotMachine.checkRequestStatus",
                },
              },
              entry: {
                type: "sendMessageToUser",
                params: {
                  msg: 'Please enter valid service request number',
                },
              },
            },
          },
        },
        createServiceRequest: {
          initial: "showForm",
          on: {
            mainMenu: {
              target: "promptUserForService",
            },
          },
          states: {
            start: {
              on: {
                next: {
                  target: "showForm",
                },
              },
              tags: ["initial"]
            },

            showForm: {
              on: {
                next: {
                  target: "waitForSubmit",
                },
              },
              tags: ["promptUser"],
              entry: [{
                type: "sendMessageToUser",
                params: {
                  msg: "Create Service Request",
                },
              },
              {
                type: "sendMessageToUser",
                params: {
                  msg: 'Please fill the form Details\n',
                },
              }
              ]
              // exit:raise({type:"next"),

            },
            waitForSubmit: {
              on: {
                next: {
                  target: "processForm",
                },
              },
            },
            processForm: {
              on: {
                next: {
                  target: "showThanksMessage",
                },
              },
              entry: assign({
                CSRDetails: ({ event }) => event.payload.utterance,
              }),
            },
            showThanksMessage: {
              entry: {
                type: "sendMessageToUser",
                params: {
                  msg: "Thanks.Your service request has been created\n",
                },
              },
            },
          },
        },
        faqs: {
          initial: "promptForQuery",
          on: {
            mainMenu: {
              target: "promptUserForService",
            },
          },

          states: {
            promptForQuery: {
              entry: [{
                type: "sendMessageToUser",
                params: {
                  msg: 'FAQs',
                },
              },
              {
                type: "sendMessageToUser",
                params: {
                  msg: '1. Select one of the trending FAQs(SELECT) \n 2.Put your query in text box(PUT).',
                },
              },
              ],
              on: {
                next: "waitingForFAQAction"
              },
              tags: ["promptUser"],
            },
            waitingForFAQAction: {
              on: {
                next: "processForFAQAction",

              }
            },
            processForFAQAction: {
              entry: assign({
                inputFAQAction: ({ event }) => event.payload.utterance,
              }),
              on: {
                next: "triggerSpecificFAQAction"
              }
            },
            triggerSpecificFAQAction: {
              entry: [{
                type: 'sendMessageToUser', params: (context) => ({
                  msg: `Processing Action`
                })
              },
              ],
              invoke: {
                id: 'getUser',
                src: 'fetchFAQAction',
                input: ({ context: { inputFAQAction } }) => ({ inputFAQAction }),
                onDone: {
                  actions: ["FAQAction"]
                },
                onError: {
                  target: 'failure',

                },

              },
              // tags: ["promptUser"],
              on: {
                goToSelect: "selectQuery",
                goToPUT: "putQueryInTextbox",
              }
            },
            selectQuery: {
              initial: "promptForqueryToSelect",
              states: {
                promptForqueryToSelect: {
                  on: {
                    next: {
                      target: "waitingForQueryToSelect",
                    },
                  },
                  entry: [{
                    type: "sendMessageToUser",
                    params: {
                      msg: '"\nPlease select query from list"',
                    },
                  },
                  {
                    type: "sendMessageToUser",
                    params: {
                      msg: '1.Query1(1)  2.Query2(2)',
                    },
                  }]
                },

                waitingForQueryToSelect: {
                  on: {
                    next: "processQuery",
                  }
                },

                processQuery: {
                  entry: assign({
                    inputFAQAction: ({ event }) => event.payload.utterance,
                  }),
                  on: {
                    next: "triggerForSelectedQuery"
                  }

                },

                triggerForSelectedQuery: {
                  entry: [{
                    type: 'sendMessageToUser', params: (context) => ({
                      msg: `Processing request`
                    })
                  },
                  ],
                  invoke: {
                    id: 'getUser',
                    src: 'fetchSelectedQuery',
                    input: ({ context: { inputSelectedQuery } }) => ({ inputSelectedQuery }),
                    onDone: {
                      actions: ["actionForSelectedQuery"]
                    },
                    onError: {
                      target: 'failure',

                    },

                  },
                  tags: ["promptUser"],
                  on: {
                    goToQuery1: "query1",
                    goToQuery2: "query2"
                  }

                },

                query1: {
                  initial: "responseForQuery1",
                  states: {
                    responseForQuery1: {
                      entry:
                        [{
                          type: 'sendMessageToUser', params: (context) => ({
                            msg: `Response for Query1`
                          })
                        },
                        ],

                    },
                  }
                },

                query2: {
                  initial: "responseForQuery2",
                  states: {
                    responseForQuery2: {
                      entry:
                        [{
                          type: 'sendMessageToUser', params: (context) => ({
                            msg: `Response for Query2`
                          })
                        },
                        ],

                    },
                  }
                },

                failure: {}
              },
            },
            putQueryInTextbox: {
              initial: "promptForQueryInTextBox",
              states: {
                promptForQueryInTextBox: {
                  on: {
                    next: {
                      target: "waitingForQueryInTextbox",
                    },
                  },
                  entry: {
                    type: "sendMessageToUser",
                    params: {
                      msg: "Enter the query in textbox"
                    }
                  },
                },

                waitingForQueryInTextbox: {
                  on: {
                    next: "processTextboxQuery",
                  }
                },

                processTextboxQuery: {
                  entry: [assign({
                    inputPutQuery: ({ event }) => event.payload.utterance,
                  }),
                  // { type: 'sendMessageToUser', params: { msg: 'let me check.' } },
                  { type: 'sendMessageToUser', params: { msg: 'I am sorry, I am still learning. Could you kindly rephrase it for me once more?' } }
                  ],
                },
              },
            },
            failure: {}
          },
        },
        failure: {},

        sessionTimeoutState: {
          initial: "start",
          states: {
            start: {
              on: {
                next: {
                  target: "showMessage",
                },
              },
            },
            showMessage: {
              on: {
                endChat: {
                  target: "endSession",
                },
                reStart: {
                  target: "#ChatbotMachine.greetUser",
                },
              },
              description:
                "Hey there! It appears that your session has timed out due to inactivity. To continue, click on restart and begin a new conversation. Alternatively, you can click on 'End Chat' to end the session. Thank you for understanding!",
            },
            endSession: {
              type: "final",
            },
          },
        },
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
  botflowActor.subscribe(saveMachine)
  //4. update ui to show current state name
  botflowActor.subscribe(e => {
    // if(e.value==="start"){
    //   botflowActor.send({ type: "next" });
    // }
    renderStateName(e.value as string)
  })

  // 5. we start the actor
  botflowActor.start();

  // 6.1 on purpose move it next so that it reaches waitingForName state

  console.log("force next");

  botflowActor.send({ type: "next" });

  // 6.2 we want machine to continue until it cant move further
  // for ex when user input is required
  // here we added tags to identify such states
  while (!botflowActor.getSnapshot().hasTag("promptUser") && botflowActor.getSnapshot().can({ type: "next" })) {
    console.log("next step", botflowActor.getSnapshot().error);
    botflowActor.send({ type: "next", payload: { utterance: textInput || "" } });
  }

  // 7. we the save the current state to json
  // so that later we can restore it and conversation continues from where it left off
  // right now ,we're using browser storage , but this code will run on server so db will be used
  saveMachine();
  // renderStateName("-----------------");




  console.log("end");

  function saveMachine() {
    const serializedBotFlow = botflowActor.getPersistedSnapshot();
    sessionStorage.setItem("bf", JSON.stringify(serializedBotFlow));
  }
}



// show state name to UI
function renderStateName(name: string) {
  const p = document.createElement("p");
  p.innerText = JSON.stringify(name);
  // document.getElementById("state")!.append(p);
  document.getElementById("state")!.innerHTML = p.innerText;
}


function getPersistedMachineIfExists(): Snapshot<unknown> | undefined {
  try {
    return JSON.parse(sessionStorage.getItem("bf") || "")
  } catch (error) {
    return undefined;
  }
}

