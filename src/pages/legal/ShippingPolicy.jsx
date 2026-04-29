import LegalPageLayout from '../../components/LegalPageLayout';

export default function ShippingPolicy() {
    return (
        <LegalPageLayout title="Shipping Policy" lastUpdated="April 2026">
            <p>At JGM Industries, we are committed to delivering your wellness products with the utmost care and precision. Please review our shipping practices below.</p>
            
            <h2>1. Processing Time</h2>
            <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

            <h2>2. Domestic Shipping Rates and Estimates</h2>
            <p>We offer standard and expedited shipping options within India. Shipping charges for your order will be calculated and displayed at checkout.</p>
            <ul>
                <li><strong>Standard Shipping:</strong> 3-5 business days. Free for orders over ₹1000.</li>
                <li><strong>Expedited Shipping:</strong> 1-2 business days. Flat rate of ₹150.</li>
            </ul>

            <h2>3. International Shipping</h2>
            <p>Currently, we only ship within India. We are working to expand our logistics to support international wellness seekers in the near future.</p>

            <h2>4. Order Tracking</h2>
            <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.</p>

            <h2>5. Damages</h2>
            <p>JGM Industries ensures rigorous packaging standards. However, if you receive a damaged product, please contact us immediately at official@jgmindustries.in with your order number and a photo of the item's condition.</p>
        </LegalPageLayout>
    );
}
