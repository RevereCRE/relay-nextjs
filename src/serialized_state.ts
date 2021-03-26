import type { GraphQLTaggedNode, RecordSource } from 'relay-runtime';

export interface WiredSerializedState {
  records: ReturnType<RecordSource['toJSON']>;
  query: GraphQLTaggedNode;
  variables: Record<string, unknown>;
}

interface WiredWindow {
  __wired__?: WiredSerializedState;
}

export function getWiredSerializedState(): WiredSerializedState | undefined {
  return (window as WiredWindow)?.__wired__;
}
