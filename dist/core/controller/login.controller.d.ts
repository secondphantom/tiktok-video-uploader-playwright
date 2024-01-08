import { LoginService } from "../service/login.service";
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    login: () => Promise<{
        isLogin: boolean;
    }>;
}
