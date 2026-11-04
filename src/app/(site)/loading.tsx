/**
 * Shown under the top bar while the server renders a public page you've
 * navigated to (e.g. a case study that isn't cached yet).
 */
import { Loader } from "@/components/layout/Loader";

export default function Loading() {
  return <Loader />;
}
