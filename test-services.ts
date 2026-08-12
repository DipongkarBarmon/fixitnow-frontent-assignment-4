import { getAllServiceAction } from "./app/(publicGroup)/_actions/serviceAction";
getAllServiceAction().then(res => console.log(JSON.stringify(res, null, 2)));
