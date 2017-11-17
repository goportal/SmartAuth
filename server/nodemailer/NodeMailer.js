const ejs = require('ejs');
const fs = require('fs');
const _padraoTransporter = require('./config/transporter');
const _padraoMailer = require('./config/mailer');
const _padraoTemplate = require('./config/template');
const nodemailer = require('nodemailer');
const path = require('path');

/**
 *
 * @param {Object} optionsTransporter padrão vazio
 * @param {Object} optionsTemplate padrão vazio
 * @param {Object} optionsMailer padrão vazio
 * @constructor
 */
function NodeMailer(
    optionsTransporter = _padraoTransporter,
    optionsMailer = _padraoMailer,
    optionsTemplate = _padraoTemplate) {

    /**
     * configurações da Transporter
     */
    host = optionsTransporter.host ? optionsTransporter.host : _padraoTransporter.host;
    port = optionsTransporter.port ? optionsTransporter.port : _padraoTransporter.port;
    secure = optionsTransporter.secure ? optionsTransporter.secure : _padraoTransporter.secure;
    auth = {
        user: optionsTransporter.auth.user ? optionsTransporter.auth.user : _padraoTransporter.auth.user,
        pass: optionsTransporter.auth.pass ? optionsTransporter.auth.pass : _padraoTransporter.auth.pass
    };

    /**
     * configurações da Options de envio do e-mail
     */
    from = optionsMailer.from ? optionsMailer.from : _padraoMailer.from;
    to = optionsMailer.to ? optionsMailer.to : _padraoMailer.to;
    subject = optionsMailer.subject ? optionsMailer.subject : _padraoMailer.subject;
    html = optionsMailer.html ? optionsMailer.html : optionsMailer.html = _padraoMailer.html;

    /**
     * configurações para geracao do template
     */
    template = optionsTemplate.template ? optionsTemplate.template : _padraoTemplate.template;
    codificacao = optionsTemplate.codificacao ? optionsTemplate.codificacao : _padraoTemplate.codificacao;
    mensagens = optionsTemplate.mensagens ? optionsTemplate.mensagens : _padraoTemplate.mensagens;

    /**
     * função interna que gera o html do template
     * @function
     * @return {String}
     */
    let geraHTML = function () {
        html = ejs.render(
            fs.readFileSync(path.join(__dirname, template), codificacao),
            mensagens
        );
    };

    /**
     * Retorna um objeto literal com as configurações necessárias para o funcionamento do Transporter
     * @returns {Object}
     */
    this.geraObjetoTransporter = function () {
        return {
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: auth.user,
                pass: auth.pass
            }
        }
    };

    /**
     * Retorna um objeto literal com as configurações necessárias para o funcionamento do envio do e-mail
     * @returns {Object}
     */
    this.geraObjetoOptions = function () {
        return {
            from: from,
            to: to,
            subject: subject,
            html: html
        }
    };

    /**
     * Retorna um objeto literal com as configurações necessárias para a geração dos templates
     * @returns {Object}
     */
    this.geraObjetoOptionsTemplate = function () {
        return {
            template: template,
            codificacao: codificacao,
            mensagens: mensagens
        }
    };

    /**
     * Retorna o html gerado para o template
     * @return {String}
     */
    this.geraHtmlTemplate = function () {
        geraHTML();
        return html;
    };

    /**
     * Retorna os valores de todas as propriedades
     * @return {Object}
     */
    this.geraTodasAsConfiguracoes = function () {
        return {
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: auth.user,
                pass: auth.pass
            },
            from: from,
            to: to,
            subject: subject,
            html: html,
            template: template,
            codificacao: codificacao,
            mensagens: mensagens,
        }
    };

    /**
     * Retorna um objeto único com todas as configurações padrões
     * @method
     * @return {Object}
     */
    this.geraObjetoComValoresPadroes = function () {

        let padraoTransporter = _padraoTransporter;
        let padraoMailer = Object.keys(_padraoMailer);
        let padraoTemplate = Object.keys(_padraoTemplate);

        for (let i = 0; i < padraoMailer.length; i++) {
            padraoTransporter[padraoMailer[i]] = _padraoMailer[padraoMailer[i]];
        }
        for (let j = 0; j < padraoTemplate.length; j++) {
            padraoTransporter[padraoTemplate[j]] = _padraoTemplate[padraoTemplate[j]];
        }

        return padraoTransporter;
    };

    this.setHost = function (_host) {
        host = _host;
    };

    this.getHost = function () {
        return host;
    };

    this.setPort = function (_port) {
        port = _port;
    };

    this.getPort = function () {
        return port;
    };

    this.setSecure = function (_secure) {
        secure = _secure;
    };

    this.getSecure = function () {
        return secure;
    };

    this.setAuth = function (_auth) {
        auth = _auth;
    };

    this.getAuth = function () {
        return auth;
    };

    this.setFrom = function (_from) {
        from = _from;
    };

    this.getFrom = function () {
        return from;
    };

    this.setTo = function (_to) {
        to = _to;
    };

    this.getTo = function () {
        return to;
    };

    this.setSubject = function (_subject) {
        subject = _subject;
    };

    this.getSubject = function () {
        return subject;
    };

    this.setHtml = function (_html) {
        html = _html;
    };

    this.getHtml = function () {
        return html;
    };

    this.setTemplate = function (_template) {
        template = _template;
    };

    this.getTemplate = function () {
        return template;
    };

    this.setCodificacao = function (_codificacao) {
        codificacao = _codificacao;
    };

    this.getCodificacao = function () {
        return codificacao;
    };

    this.setMensagens = function (_mensagens) {
        mensagens = _mensagens;
    };

    this.getMensagens = function () {
        return mensagens;
    };

    /**
     *
     * @param callback {Function}
     */
    this.enviarEmail = function (callback) {

        if (this.getTemplate() !== null)
            geraHTML();

        nodemailer.createTransport(
            this.geraObjetoTransporter()
        ).sendMail(
            this.geraObjetoOptions(),
            (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                callback(error);
            }
        );
    };
}
module.exports = NodeMailer;