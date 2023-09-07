<template><div><h1 id="paypal-integration-with-formester" tabindex="-1"><a class="header-anchor" href="#paypal-integration-with-formester" aria-hidden="true">#</a> PayPal Integration with Formester</h1>
<p>To integrate PayPal's payment gateway with Formester and start collecting payments seamlessly, you'll need a Client ID and Secret Key from PayPal. These unique codes allow the payment gateway to securely process online payments. Here's a step-by-step guide to obtaining your PayPal Client ID and Secret Key.</p>
<h2 id="get-your-paypal-client-id-and-secret-key" tabindex="-1"><a class="header-anchor" href="#get-your-paypal-client-id-and-secret-key" aria-hidden="true">#</a> Get Your PayPal Client ID and Secret Key</h2>
<h3 id="step-1-create-a-paypal-business-account" tabindex="-1"><a class="header-anchor" href="#step-1-create-a-paypal-business-account" aria-hidden="true">#</a> Step 1: Create a PayPal Business Account</h3>
<p><img src="/assets/images/paypal-integration/paypal_business_signup.png" alt="PayPal Business Signup Page"></p>
<p>If you don't have an active PayPal business account, <a href="https://www.paypal.com/us/webapps/mpp/account-selection" target="_blank" rel="noopener noreferrer">create<ExternalLinkIcon/></a> one in minutes. Provide necessary business details and connect your business bank account to enable smooth transactions.</p>
<h3 id="step-2-access-the-paypal-developer-dashboard" tabindex="-1"><a class="header-anchor" href="#step-2-access-the-paypal-developer-dashboard" aria-hidden="true">#</a> Step 2: Access the PayPal Developer Dashboard</h3>
<p><img src="/assets/images/paypal-integration/paypal_live_mode.png" alt="Toggle Live Mode"></p>
<p>Log into the <a href="https://developer.paypal.com/dashboard" target="_blank" rel="noopener noreferrer">PayPal Developer Dashboard<ExternalLinkIcon/></a> using your existing PayPal Business account credentials. Ensure that the toggle between &quot;Sandbox&quot; and &quot;Live&quot; is set to &quot;Live&quot; mode.</p>
<p><strong>NOTE</strong>: For demo purposes, the screenshots are in Sandbox mode. In your case, please make it Live mode.</p>
<h3 id="step-3-create-a-new-app" tabindex="-1"><a class="header-anchor" href="#step-3-create-a-new-app" aria-hidden="true">#</a> Step 3: Create a New App</h3>
<p><img src="/assets/images/paypal-integration/paypal_create_app.png" alt="Paypal Create App"></p>
<p>Click on <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noopener noreferrer">Apps &amp; Credentials<ExternalLinkIcon/></a> from the developer dashboard. Under &quot;REST API Apps,&quot; click the &quot;Create App&quot; button. Fill in the required details, including the app name, select merchant type, and create the app.</p>
<h3 id="step-4-copy-your-client-id-and-secret-key" tabindex="-1"><a class="header-anchor" href="#step-4-copy-your-client-id-and-secret-key" aria-hidden="true">#</a> Step 4: Copy Your Client ID and Secret Key</h3>
<p><img src="/assets/images/paypal-integration/paypal_credentials.png" alt="Paypal Api credentials"></p>
<p>Once you've created the app, go to <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noopener noreferrer">Apps &amp; Credentials<ExternalLinkIcon/></a> Copy your &quot;Client ID&quot; and &quot;Secret&quot;. Now you can use your PayPal Client ID and Secret Key to <a href="#use-your-paypal-client-id-and-secret-key-to-integrate-with-formester">integrate PayPal with Formester</a> and provide a seamless payment experience to your customers.</p>
<h2 id="find-your-existing-paypal-client-id-and-secret-key" tabindex="-1"><a class="header-anchor" href="#find-your-existing-paypal-client-id-and-secret-key" aria-hidden="true">#</a> Find your Existing PayPal Client ID and Secret Key</h2>
<p>If you need to access your existing PayPal Client ID and Secret Key, follow these steps:</p>
<h3 id="step-1-log-in-to-the-paypal-developer-website" tabindex="-1"><a class="header-anchor" href="#step-1-log-in-to-the-paypal-developer-website" aria-hidden="true">#</a> Step 1: Log in to the PayPal Developer Website</h3>
<p>Log in to the <a href="(https://developer.paypal.com/dashboard)">developer dashboard</a> to access your PayPal Client ID and Secret Key. This information is not available through your regular PayPal account.</p>
<h3 id="step-2-click-on-apps-credentials" tabindex="-1"><a class="header-anchor" href="#step-2-click-on-apps-credentials" aria-hidden="true">#</a> Step 2: Click on &quot;Apps &amp; Credentials&quot;</h3>
<p>Under <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noopener noreferrer">Apps &amp; Credentials<ExternalLinkIcon/></a> select the name of the app for which you need to retrieve the Client ID and Secret Key.</p>
<h3 id="step-3-retrieve-your-codes" tabindex="-1"><a class="header-anchor" href="#step-3-retrieve-your-codes" aria-hidden="true">#</a> Step 3: Retrieve Your Codes</h3>
<p><img src="/assets/images/paypal-integration/paypal_credentials.png" alt="Paypal Api credentials"></p>
<p>Find and copy your PayPal Client ID and Secret Key from the selected app. Click &quot;show&quot; to reveal the Secret Key.</p>
<p>With your PayPal Client ID and Secret Key in hand, you're all set to <a href="#use-your-paypal-client-id-and-secret-key-to-integrate-with-formester">integrate PayPal with Formester</a> and provide a seamless payment experience to your customers.</p>
<h2 id="use-your-paypal-client-id-and-secret-key-to-integrate-with-formester" tabindex="-1"><a class="header-anchor" href="#use-your-paypal-client-id-and-secret-key-to-integrate-with-formester" aria-hidden="true">#</a> Use Your PayPal Client ID and Secret Key To Integrate with Formester</h2>
<h3 id="step-1-go-to-the-formester-payments-section" tabindex="-1"><a class="header-anchor" href="#step-1-go-to-the-formester-payments-section" aria-hidden="true">#</a> Step 1: Go to the Formester Payments Section</h3>
<p><img src="/assets/images/paypal-integration/formester_payments.png" alt="Formester Payments Page"></p>
<p>Navigate to the Formester app and access the <a href="https://app.formester.com/payments" target="_blank" rel="noopener noreferrer">Payments section<ExternalLinkIcon/></a>. From the available payment options, choose PayPal as the preferred payment gateway.</p>
<h3 id="step-2-fill-in-the-required-details" tabindex="-1"><a class="header-anchor" href="#step-2-fill-in-the-required-details" aria-hidden="true">#</a> Step 2: Fill in the required details</h3>
<p><img src="/assets/images/paypal-integration/formester_paypal_integration.png" alt="Formester Payments Page"></p>
<p>Provide your PayPal email address along with the Client ID and Secret Key you obtained earlier. This information will enable Formester to securely communicate with PayPal and process payments seamlessly.</p>
<h3 id="step-3-integrate" tabindex="-1"><a class="header-anchor" href="#step-3-integrate" aria-hidden="true">#</a> Step 3: Integrate</h3>
<ul>
<li>After entering the required details, click on the &quot;Integrate&quot; button to finalize the integration process.</li>
</ul>
<p>With these simple steps, you've successfully integrated PayPal with Formester. Now, you can <a href="#how-to-accept-paypal-payments-using-formester-form">create a form to accept PayPal payments</a>.</p>
<h2 id="how-to-accept-paypal-payments-using-formester-form" tabindex="-1"><a class="header-anchor" href="#how-to-accept-paypal-payments-using-formester-form" aria-hidden="true">#</a> How to Accept PayPal Payments using Formester Form</h2>
<p>Formester makes it easy to accept PayPal payments through your forms. Follow these steps to set up PayPal payments in your Formester form:</p>
<h3 id="step-1-create-a-new-form" tabindex="-1"><a class="header-anchor" href="#step-1-create-a-new-form" aria-hidden="true">#</a> Step 1: Create a New Form</h3>
<p><img src="/assets/images/paypal-integration/formester_create_form.png" alt="Formester Create Form"></p>
<p>To create a new form, sign into your Formester account and select &quot;Create Form&quot;. Give your form a name and some other information, then click &quot;Submit&quot; to continue.</p>
<h3 id="step-2-add-paypal-field" tabindex="-1"><a class="header-anchor" href="#step-2-add-paypal-field" aria-hidden="true">#</a> Step 2: Add PayPal Field</h3>
<p><img src="/assets/images/paypal-integration/paypal_component.png" alt="Paypal Field"></p>
<p>In the left sidebar, find the &quot;PayPal&quot; field under &quot;Payment&quot;. Drag and drop the PayPal field onto your form.</p>
<h3 id="step-3-configure-paypal-field" tabindex="-1"><a class="header-anchor" href="#step-3-configure-paypal-field" aria-hidden="true">#</a> Step 3: Configure PayPal Field</h3>
<p><img src="/assets/images/paypal-integration/payment_configuration.png" alt="Payment Configuration"></p>
<p>Select the PayPal field on your form to open the field settings. Provide the necessary details, such as the label, description, and payment amount. Customize the appearance and behavior of the PayPal field and form according to your preferences.</p>
<h3 id="step-4-save-your-form" tabindex="-1"><a class="header-anchor" href="#step-4-save-your-form" aria-hidden="true">#</a> Step 4: Save Your Form</h3>
<p>Once you have configured the PayPal field to your satisfaction, click on the &quot;Save&quot; button to save your form.</p>
<p>Congratulations! Your Formester form is now set up to accept PayPal payments. When users fill out the form, they can make secure and hassle-free payments using the PayPal payment gateway. Enjoy the convenience of managing transactions and providing a smooth payment experience to your users!</p>
</div></template>


