import { Show } from 'solid-js';
import { Navigate } from '@solidjs/router';

function ProtectedRoute(props) {
  return (
    <Show when={props.user()} fallback={<Navigate href="/auth" />}>
      {props.children}
    </Show>
  );
}

export default ProtectedRoute;