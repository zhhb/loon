import * as Express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as Winston from 'winston';
import {MVCContainer} from "../mvc/MVCContainer";
import {Log} from "../logger/index";

export abstract class TypedApplication {

    public server: Express.Application;

    protected port: number = 8080;

    protected logLevel: string;

    protected logTransports: Winston.TransportInstance[];

    constructor() {
        this
            .$onInitServer()
            .$onInitMiddlewares()
            .$onInitRoutes()
            .$onReady();
    }

    protected $onInitServer() {
        this.server = Express();

        if (this.logLevel) {

            Log.logger.configure({
                level: this.logLevel
            });
        }

        if (this.logTransports) {

            Log.logger.configure({
                transports: this.logTransports
            });

        }

        return this;
    }

    protected $onInitMiddlewares() {
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cookieParser());
        return this;
    }

    protected $onInitRoutes() {
        MVCContainer
            .getRoutes()
            .map(item => this.server.use(item.baseRoute, item.router));

        return this;
    }

    protected $onReady() {
        return this;
    }

    protected $onError() {
    }

    public start() {

        this.server.listen(this.port, () => {
            Log.logger.info(`Application is listening on port ${this.port}`);
        });
    }
}