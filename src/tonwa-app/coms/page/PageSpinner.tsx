import { Spinner } from "tonwa-com";

export function PageSpinner() {
    return <div className=" tonwa-band-container bg-white d-flex justify-content-center">
        <Spinner className="m-5 text-center text-info" />
    </div>;
}
