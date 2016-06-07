module.exports = {
    user:{
        socialInfoSubmissionSuccess: 'You have successfully submitted required information of your social account',
        missingSocialPlatformId: 'You have to provide social account id to signup into this application',
        missingDetailsInfo: 'Your valid phone number and address are required to continue.',
        missingInfoAtVerification: 'Insufficient information to verify your phone number',
        errorOnSmsAttemptsLookUp: 'An error has occurred during sms verification attempts lookup',
        missMatchedVerificationCode: 'Your provided verification code has not matched with the code sent to your mobile number.',
        smsVerificationSendSuccess: 'A verification code has been sent to your mobile number, submit that code to verify your account',
        smsVerificationLimitExited: 'Max limit of sms verification attempt has exited',
        signUpSuccess: 'Thank you, you have successfully signed up at ShopUp platform',
        smsVerificationSendError: 'We cannot seem to send message to your mobile number. Please try again in few minutes, try with a different operator, or contact us.'
    },
    cache: {
        emptyKeyOrValue: 'Insufficient information!',
        unexpectedEError: 'An unexpected error occurred during read from cache!'
    },
    http: {
        error400: {error: 400, message: 'Bad Request; Request cannot be fulfilled due to bad syntax'},
        error401: {error: 401, message: 'Unauthorized; Authentication is required to get access into requested resource'},
        error403: {error: 403, message: 'Forbidden; Not enough access is granted to get into this resource'},
        error404: {error: 404, message: 'Not Found; Requested resource could not be found'},
        error500: {error: 500, message: 'Internal Server Error; An error occurred when request was parsing'},
        error503: {error: 503, message: 'Service Unavailable; Application is currently under maintenance'}
    }
};