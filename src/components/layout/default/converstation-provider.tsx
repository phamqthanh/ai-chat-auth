import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { faker } from "@faker-js/faker";

type Props = {};

type ConversationConverted = { label?: string; items: Model.Conversation[] };
interface ConverstationState {
  conversations: any[];
  sortedConversations: Record<
    "recent" | "dynamicMonths" | "dynamicYears",
    Record<string, ConversationConverted>
  >;
}

const createData = (item: number) => {
  const array: Model.Conversation[] = [];
  for (let i = 0; i < item; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const createDay = faker.date.between({ from: date, to: new Date() });

    array.push({
      id: crypto.randomUUID(),
      content: faker.lorem.sentence(5),
      title: faker.lorem.sentence(5),
      user_id: "123123",
      created_at: createDay.toISOString(),
      updated_at: faker.date.future({ refDate: createDay }).toISOString(),
    });
    // const element = array[i];
  }
  return array;
};
function diffDay(currentTime: Date, lastTime: Date) {
  return Math.round((currentTime.getTime() - lastTime.getTime()) / 864e5);
}
function isCurrentYear(time: Date) {
  return time.getFullYear() === new Date().getFullYear();
}
function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-US", options);
}

const ConversationContext = createContext<ConverstationState>(null as any);
export const useConversation = () => useContext(ConversationContext);

const ConverstationProvider = ({ children }: PropsWithChildren<Props>) => {
  const [conversations, setConversations] = useState<Model.Conversation[]>([]);
  useEffect(() => {
    setConversations(createData(20));
    // Conversation.list({}).then((d) => setConversations(d.data.data));
  }, []);

  const sortedConversations = useMemo(
    function () {
      type ConversationConverted = { label?: string; items: Model.Conversation[] };
      return conversations.reduce(
        function (obj, conversation) {
          var conversationDate = new Date(conversation.updated_at || conversation.created_at || 0),
            day = diffDay(new Date(), conversationDate);

          if (0 === day) obj.recent.today.items.push(conversation);
          else if (day <= 1) obj.recent.yesterday.items.push(conversation);
          else if (day <= 7) obj.recent.lastSeven.items.push(conversation);
          else if (day <= 30) obj.recent.lastThirty.items.push(conversation);
          else if (isCurrentYear(conversationDate)) {
            var conversationYear = conversationDate.getFullYear().toString(),
              conversationMonth = conversationDate.getMonth().toString(),
              c = "".concat(conversationYear, "-", conversationMonth);
            obj.dynamicMonths[c]
              ? obj.dynamicMonths[c].items.push(conversation)
              : (obj.dynamicMonths[c] = {
                  label: formatDate(conversationDate, {
                    month: "long",
                  }),
                  items: [conversation],
                });
          } else {
            var conversationYear = conversationDate.getFullYear().toString(),
              key = "".concat(conversationYear, "-");
            obj.dynamicYears[key]
              ? obj.dynamicYears[key].items.push(conversation)
              : (obj.dynamicYears[key] = {
                  label: formatDate(conversationDate, {
                    year: "numeric",
                  }),
                  items: [conversation],
                });
          }
          return obj;
        },
        {
          recent: {
            today: {
              label: "Today",
              items: [],
            },
            yesterday: {
              label: "Yesterday",
              items: [],
            },
            lastSeven: {
              label: "Previous 7 Days",
              items: [],
            },
            lastThirty: {
              label: "Previous 30 Days",
              items: [],
            },
          } as Record<"today" | "yesterday" | "lastSeven" | "lastThirty", ConversationConverted>,
          dynamicMonths: {} as Record<string, ConversationConverted>,
          dynamicYears: {} as Record<string, ConversationConverted>,
        }
      );
    },
    [conversations]
  );

  console.log(
    [
      sortedConversations.recent,
      sortedConversations.dynamicMonths,
      sortedConversations.dynamicYears,
    ].flatMap((e, t) => Object.entries(e).map((e) => e))
  );
  return (
    <ConversationContext.Provider
      value={{
        sortedConversations,
        conversations: [
          sortedConversations.recent,
          sortedConversations.dynamicMonths,
          sortedConversations.dynamicYears,
        ].flatMap((e, t) => Object.entries(e).map((e) => e)),
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConverstationProvider;
