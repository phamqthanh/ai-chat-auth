import { BaseModel, get, post } from "..";
type ParamList<D> = Partial<
  D & {
    limit: number;
    page: number;
    sortBy: string;
    search: string;
    [k: string]: any;
  }
>;

class ConversationClass extends BaseModel {
  public list(params: ParamList<{}>) {
    return get<Response.List<Model.Conversation>>("/conversation", { params });
  }

  public create(payload: Record<"title" | "content", string>) {
    return post<Record<"title" | "content" | "id" | "user_id", string>>("/conversation", payload);
  }
}

export const Conversation = new ConversationClass();
