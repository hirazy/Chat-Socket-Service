import { success, notFound } from '../../services/response/'
import { sendMail } from '../../services/sendgrid'
import PasswordReset, {} from './model'
import User, {} from '../user/model'

export const create = ({ bodymen: { body: { email, link } } }, res, next) =>
    User.findOne({ email: email })
    .then(notFound(res))
    .then((user) => user ? PasswordReset.create({ user }) : null)
    .then((reset) => {
        if (!reset) return null
        const { user, token } = reset
        link = `${link.replace(/\/$/, '')}/${token}`
        const content = `
        Hey, ${user.name}.<br><br>
        You requested a new password for your Server Chatapp account.<br>
        Please use the following link to set a new password. It will expire in 1 hour.
        <br><br>
        Click <b>${token}</b> to copy to clipboard and reset password.
        <br><br>
        If you didn't make this request then you can safely ignore this email. :)<br><br>
        &mdash; Server Chatapp Team
      `
        return sendMail({ toEmail: email, subject: 'Server Chat App - Password Reset', content })
    })
    .then(([response]) => response ? res.status(response.statusCode).end() : null)
    .catch(next)

// <br><br>
// <a href="${link}">Click here to reset password.</a><br><br>

export const show = ({ params: { token } }, res, next) =>
    PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => reset ? reset.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ params: { token }, bodymen: { body: { password } } }, res, next) => {
    return PasswordReset.findOne({ token })
        .populate('user')
        .then(notFound(res))
        .then((reset) => {
            if (!reset) return null
            const { user } = reset
            return user.set({ password }).save()
                .then(() => PasswordReset.deleteMany({ user }))
                .then(() => user.view(true))
        })
        .then(success(res))
        .catch(next)
}