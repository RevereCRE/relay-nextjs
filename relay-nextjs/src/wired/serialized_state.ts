import type { OperationDescriptor } from 'react-relay';
import type { GraphQLResponse, GraphQLSingularResponse } from 'relay-runtime';
import type RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';

export interface WiredSerializedState {
  operationDescriptor: OperationDescriptor;
  payload: GraphQLResponse;
}

interface WiredWindow {
  __wired__?: WiredSerializedState;
}

export function getWiredSerializedState(): WiredSerializedState | undefined {
  return (window as WiredWindow).__wired__;
}

export function hydrateRelayEnvironment(env: RelayModernEnvironment) {
  const serializedState = getWiredSerializedState();
  if (serializedState?.payload) {
    env.commitPayload(
      serializedState.operationDescriptor,
      (serializedState.payload as GraphQLSingularResponse).data!
    );
  }
}
