
# Authorize.net Integration with Formester

To integrate Authorize.net's payment gateway with Formester and start collecting payments seamlessly, you'll need an API Login ID, Transaction Key, and Signature Key from Authorize.net. These credentials allow the payment gateway to securely process online payments. Here's a step-by-step guide to obtaining your Authorize.net credentials and integrating them with Formester.


## Get Your Authorize.net API Login ID and Transaction Key

### Step 1: Sign In to Your Authorize.net Account

![Authorize.net Sign In](/assets/images/authorizenet-integration/authorizenet_signin.png)

Go to [authorize.net](https://www.authorize.net) and click on the **Sign In** button in the top navigation. From the dropdown, select **Merchants** to log in to your merchant account.

### Step 2: Create a New Account (If You Don't Have One)

![Authorize.net Sign Up](/assets/images/authorizenet-integration/authorizenet_signup.png)

If you don't have an Authorize.net merchant account, click the **Sign up now** button on the top right of the homepage to get started. Authorize.net is a Visa solution and is trusted by US merchants for secure payment processing.

### Step 3: Complete the Merchant Application

![Authorize.net Merchant Application](/assets/images/authorizenet-integration/authorizenet_merchant_application.png)

Fill in the **Merchant Application** form with your business details, including your name, email address, owner address, date of birth, Social Security Number, and job title. Once complete, submit the form to activate your account.

### Step 4: Access Your Merchant Dashboard

![Authorize.net Dashboard](/assets/images/authorizenet-integration/authorizenet_dashboard.png)

After signing in, you'll land on your Authorize.net merchant dashboard. Here you can see an overview of your transactions, quick actions, and business insights.

### Step 5: Navigate to Account and API Settings

![Authorize.net Account Menu](/assets/images/authorizenet-integration/authorizenet_account_menu.png)

In the left sidebar, click on **Account** to expand the submenu. Then click on **Account and API Settings**.

### Step 6: Open API Credentials and Keys

![Authorize.net API Settings Page](/assets/images/authorizenet-integration/authorizenet_api_settings.png)

On the Account and API Settings page, locate the **API Credentials and Keys** option under Security Settings. Click the arrow to open it.

### Step 7: Copy Your API Login ID, Transaction Key, and Signature Key

![Authorize.net API Credentials](/assets/images/authorizenet-integration/authorizenet_api_credentials.png)

On the **API Credentials and Keys** page, you'll find:

- **API Login ID** — displayed directly on the page. Copy this value.
- **Transaction Key** — click **Generate New Transaction Key** to generate one. Copy and store it securely as it will only be shown once.
- **Signature Key** — click **Generate New Signature Key** to generate one. Copy and store this securely as well.

**NOTE**: Keep your API Login ID, Transaction Key, and Signature Key private. Never share them with anyone. Change your Transaction Key regularly to maintain account security.

Now you can use these credentials to [integrate Authorize.net with Formester](#use-your-authorizenet-credentials-to-integrate-with-formester).

## Find Your Existing Authorize.net Credentials

If you already have an Authorize.net merchant account and need to retrieve your existing credentials, follow these steps:

### Step 1: Sign In to Your Authorize.net Account

Log in to your account at [authorize.net](https://www.authorize.net) by clicking **Sign In → Merchants**.

### Step 2: Navigate to Account and API Settings

In the left sidebar, click **Account** to expand the submenu, then click **Account and API Settings**.

### Step 3: Open API Credentials and Keys

Click on **API Credentials and Keys** under Security Settings.

### Step 4: Retrieve Your Credentials

![Authorize.net API Credentials](/assets/images/authorizenet-integration/authorizenet_api_credentials.png)

Your **API Login ID** is displayed on this page. To get a new **Transaction Key** or **Signature Key**, click the respective **Generate** button. Note that generating a new key will invalidate the previous one.

With your credentials in hand, proceed to [integrate Authorize.net with Formester](#use-your-authorizenet-credentials-to-integrate-with-formester).

## Use Your Authorize.net Credentials to Integrate with Formester

### Step 1: Go to the Formester Integrations Page

![Formester Integrations Page](/assets/images/authorizenet-integration/formester_integrations.png)

Navigate to the Formester app and open the [Integrations section](https://app.formester.com/integrations). You'll see the **Authorize.net** card under the Payment category. Click **+ Add integration** to begin.

### Step 2: Fill in Your Authorize.net Credentials

![Formester Authorize.net Integration Form](/assets/images/authorizenet-integration/formester_authorizenet_integration.png)

In the **Authorize.Net Integration** modal, enter:
- **API Login ID** — your Authorize.net API Login ID
- **Transaction Key** — your generated Transaction Key
- **Signature Key** — your generated Signature Key (HMAC-SHA512 hex)
- **Environment** — select **Sandbox** for testing or **Live** for real payments

### Step 3: Set the Environment and Save

![Formester Authorize.net Environment Selection](/assets/images/authorizenet-integration/formester_authorizenet_environment.png)

From the **Environment** dropdown, select **Live** to start accepting real payments. Use **Sandbox** for testing with test cards before going live. Once you've filled in all the details, click **Done** to save the integration.

**NOTE**: For demo purposes, the screenshots show Sandbox mode. Switch to Live mode when you're ready to accept real payments.

With these steps, you've successfully integrated Authorize.net with Formester. Now you can [create a form to accept Authorize.net payments](#how-to-accept-authorizenet-payments-using-formester-form).

## How to Accept Authorize.net Payments using Formester Form

Formester makes it easy to accept Authorize.net payments through your forms. Follow these steps to set up Authorize.net payments in your Formester form:

### Step 1: Create a New Form

![Formester Create Form](/assets/images/authorizenet-integration/formester_create_form.png)

Sign into your Formester account and click **Create Form**. Choose how you'd like to create your form — from scratch, using a template, with AI, or by importing an existing form. Give your form a name and click **Submit** to continue.

### Step 2: Add the Authorize.net Field

![Authorize.net Field in Form Builder](/assets/images/authorizenet-integration/authorizenet_component.png)

In the form builder, click **+ Add Elements** to open the elements panel. Under the **Payment** section, find and click **Authorize.net** to add it to your form.

### Step 3: Configure the Authorize.net Field

![Authorize.net Field Configuration](/assets/images/authorizenet-integration/authorizenet_field_config.png)

Select the Authorize.net field on your form to open the **General Properties** panel. Provide the necessary details such as the field label, description, currency (USD — Authorize.net currently supports USD only), and payment amount. You can also configure whether the amount is fixed or user-defined.

### Step 4: Publish Your Form

Once you have configured the Authorize.net field to your satisfaction, click the **Publish** button in the top right corner to make your form live. Your changes are saved automatically as you build.

Congratulations! Your Formester form is now set up to accept Authorize.net payments. When users fill out and submit the form, they'll be able to make secure payments through Authorize.net's hosted checkout. Enjoy seamless payment collection and transaction management right from your Formester dashboard!
