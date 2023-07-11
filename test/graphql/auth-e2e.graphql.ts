export const authMutations = {
  signIn: `
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      success
      accessToken
      error {
        items
        message
        statusCode
        type
      }
    }
  }`,
};
