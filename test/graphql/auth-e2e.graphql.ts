export const authMutations = {
  signIn: `
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      success
      accessToken
      error {
        code
        items
        message
        statusCode
        type
      }
    }
  }`,
};
