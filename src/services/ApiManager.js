import { Component } from "react";

export class ApiManager extends Component {
    static managerInstance = null;

    static getInstance() {
        return new ApiManager();
    }



}

export default ApiManager;