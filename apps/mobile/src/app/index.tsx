import { Redirect } from 'expo-router';

/** Work starts from the customer (R-002). */
export default function IndexRoute() {
  return <Redirect href="/customer" />;
}
