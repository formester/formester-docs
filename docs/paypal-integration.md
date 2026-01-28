
# PayPal Integration with Formester

To integrate PayPal's payment gateway with Formester and start collecting payments seamlessly, you'll need a Client ID and Secret Key from PayPal. These unique codes allow the payment gateway to securely process online payments. Here's a step-by-step guide to obtaining your PayPal Client ID and Secret Key.


## Get Your PayPal Client ID and Secret Key

### Step 1: Create a PayPal Business Account

![PayPal Business Signup Page](/assets/images/paypal-integration/paypal_business_signup.png)

If you don't have an active PayPal business account, [create](https://www.paypal.com/us/webapps/mpp/account-selection) one in minutes. Provide necessary business details and connect your business bank account to enable smooth transactions.

### Step 2: Access the PayPal Developer Dashboard

![Toggle Live Mode](/assets/images/paypal-integration/paypal_live_mode.png)

Log into the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard) using your existing PayPal Business account credentials. Ensure that the toggle between "Sandbox" and "Live" is set to "Live" mode.

**NOTE**: For demo purposes, the screenshots are in Sandbox mode. In your case, please make it Live mode.

### Step 3: Create a New App

![Paypal Create App](/assets/images/paypal-integration/paypal_create_app.png)

Click on [Apps & Credentials](https://developer.paypal.com/dashboard/applications) from the developer dashboard. Under "REST API Apps," click the "Create App" button. Fill in the required details, including the app name, select merchant type, and create the app.

### Step 4: Copy Your Client ID and Secret Key

![Paypal Api credentials](/assets/images/paypal-integration/paypal_credentials.png)

Once you've created the app, go to [Apps & Credentials](https://developer.paypal.com/dashboard/applications) Copy your "Client ID" and "Secret". Now you can use your PayPal Client ID and Secret Key to [integrate PayPal with Formester](#use-your-paypal-client-id-and-secret-key-to-integrate-with-formester) and provide a seamless payment experience to your customers.

## Find your Existing PayPal Client ID and Secret Key

If you need to access your existing PayPal Client ID and Secret Key, follow these steps:

### Step 1: Log in to the PayPal Developer Website

Log in to the [developer dashboard](https://developer.paypal.com/dashboard) to access your PayPal Client ID and Secret Key. This information is not available through your regular PayPal account.

### Step 2: Click on "Apps & Credentials"

Under [Apps & Credentials](https://developer.paypal.com/dashboard/applications) select the name of the app for which you need to retrieve the Client ID and Secret Key.

### Step 3: Retrieve Your Codes

![Paypal Api credentials](/assets/images/paypal-integration/paypal_credentials.png)

Find and copy your PayPal Client ID and Secret Key from the selected app. Click "show" to reveal the Secret Key.

With your PayPal Client ID and Secret Key in hand, you're all set to [integrate PayPal with Formester](#use-your-paypal-client-id-and-secret-key-to-integrate-with-formester) and provide a seamless payment experience to your customers.

## Use Your PayPal Client ID and Secret Key To Integrate with Formester

### Step 1: Go to the Formester Payments Section

![Formester Payments Page](/assets/images/paypal-integration/formester_payments.png)

Navigate to the Formester app and access the [Payments section](https://app.formester.com/integrations). From the available payment options, choose PayPal as the preferred payment gateway.


### Step 2: Fill in the required details

![Formester Payments Page](/assets/images/paypal-integration/formester_paypal_integration.png)

Provide your PayPal email address along with the Client ID and Secret Key you obtained earlier. This information will enable Formester to securely communicate with PayPal and process payments seamlessly.

### Step 3: Integrate
- After entering the required details, click on the "Integrate" button to finalize the integration process.

With these simple steps, you've successfully integrated PayPal with Formester. Now, you can [create a form to accept PayPal payments](#how-to-accept-paypal-payments-using-formester-form).

## How to Accept PayPal Payments using Formester Form

Formester makes it easy to accept PayPal payments through your forms. Follow these steps to set up PayPal payments in your Formester form:

### Step 1: Create a New Form

![Formester Create Form](/assets/images/paypal-integration/formester_create_form.png)

To create a new form, sign into your Formester account and select "Create Form". Give your form a name and some other information, then click "Submit" to continue.

### Step 2: Add PayPal Field

![Paypal Field](/assets/images/paypal-integration/paypal_component.png)

In the left sidebar, find the "PayPal" field under "Payment". Drag and drop the PayPal field onto your form.

### Step 3: Configure PayPal Field

![Payment Configuration](/assets/images/paypal-integration/payment_configuration.png)

Select the PayPal field on your form to open the field settings. Provide the necessary details, such as the label, description, and payment amount. Customize the appearance and behavior of the PayPal field and form according to your preferences.

### Step 4: Save Your Form
Once you have configured the PayPal field to your satisfaction, click on the "Save" button to save your form.

Congratulations! Your Formester form is now set up to accept PayPal payments. When users fill out the form, they can make secure and hassle-free payments using the PayPal payment gateway. Enjoy the convenience of managing transactions and providing a smooth payment experience to your users!
