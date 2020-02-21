import * as Yup from 'yup';

interface GithubHeader {
    'x-github-event': string;
    'x-github-delivery': string;
    'x-hub-signature': string;
}

export const headerValidationSchema: Yup.ObjectSchema<GithubHeader> = Yup.object().shape({
    "x-github-delivery": Yup.string().required(),
    "x-github-event": Yup.string().required(),
    "x-hub-signature": Yup.string().required(),
});