import type { MessageSquare, Users, ShoppingCart, Briefcase, GraduationCap, Heart, Award } from "lucide-react";

export interface TemplateField {
    label: string;
    labelKey: string;
    type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "MULTIPLE_CHOICE";
    description?: string;
    placeholder?: string;
    isRequired: boolean;
    options?: { label: string; value: string }[];
}

export interface FormTemplate {
    id: string;
    title: string;
    description: string;
    icon: MessageSquare | Users | ShoppingCart | Briefcase | GraduationCap | Heart | Award;
    category: string;
    features: string[];
    fields: TemplateField[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
    {
        id: "customer-feedback",
        title: "Customer Feedback",
        description: "Collect valuable feedback with rating scales, multiple choice, and open responses.",
        icon: null as any,
        category: "Business",
        features: ["Rating scales", "Multiple choice", "Text feedback"],
        fields: [
            { label: "Full Name", labelKey: "full_name", type: "TEXT", placeholder: "Enter your full name", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { 
                label: "How would you rate our service?", 
                labelKey: "service_rating", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Excellent", value: "excellent" },
                    { label: "Good", value: "good" },
                    { label: "Average", value: "average" },
                    { label: "Poor", value: "poor" },
                ]
            },
            { label: "What did you like most?", labelKey: "liked_most", type: "TEXT", placeholder: "Tell us what you enjoyed...", isRequired: false },
            { label: "What could we improve?", labelKey: "improvement_suggestions", type: "TEXT", placeholder: "Share your suggestions...", isRequired: false },
            { label: "Would you recommend us to others?", labelKey: "would_recommend", type: "YES_NO", isRequired: true },
        ],
    },
    {
        id: "event-registration",
        title: "Event Registration",
        description: "Streamline event planning with attendee information and preferences capture.",
        icon: null as any,
        category: "Events",
        features: ["Attendee info", "Dietary needs", "Payment"],
        fields: [
            { label: "Full Name", labelKey: "full_name", type: "TEXT", placeholder: "Enter your full name", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { label: "Phone Number", labelKey: "phone", type: "TEXT", placeholder: "+1 (555) 000-0000", isRequired: true },
            { label: "Number of Attendees", labelKey: "attendee_count", type: "NUMBER", placeholder: "1", isRequired: true },
            { 
                label: "Dietary Restrictions", 
                labelKey: "dietary_restrictions", 
                type: "MULTIPLE_CHOICE", 
                isRequired: false,
                options: [
                    { label: "None", value: "none" },
                    { label: "Vegetarian", value: "vegetarian" },
                    { label: "Vegan", value: "vegan" },
                    { label: "Gluten-free", value: "gluten_free" },
                    { label: "Other", value: "other" },
                ]
            },
            { label: "Special Requests", labelKey: "special_requests", type: "TEXT", placeholder: "Any special accommodations needed?", isRequired: false },
        ],
    },
    {
        id: "product-order",
        title: "Product Order",
        description: "Professional order forms with product selection and payment processing.",
        icon: null as any,
        category: "E-commerce",
        features: ["Product catalog", "Quantity", "Checkout"],
        fields: [
            { label: "Customer Name", labelKey: "customer_name", type: "TEXT", placeholder: "Enter your name", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { 
                label: "Product Selection", 
                labelKey: "product", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Basic Plan - $9/mo", value: "basic" },
                    { label: "Pro Plan - $29/mo", value: "pro" },
                    { label: "Enterprise Plan - $99/mo", value: "enterprise" },
                ]
            },
            { label: "Quantity", labelKey: "quantity", type: "NUMBER", placeholder: "1", isRequired: true },
            { label: "Shipping Address", labelKey: "shipping_address", type: "TEXT", placeholder: "Enter full shipping address", isRequired: true },
            { label: "Additional Notes", labelKey: "notes", type: "TEXT", placeholder: "Any special instructions?", isRequired: false },
        ],
    },
    {
        id: "job-application",
        title: "Job Application",
        description: "Comprehensive application forms that collect resumes and candidate info.",
        icon: null as any,
        category: "HR",
        features: ["File uploads", "Experience", "Skills"],
        fields: [
            { label: "Full Name", labelKey: "full_name", type: "TEXT", placeholder: "Enter your full name", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { label: "Phone Number", labelKey: "phone", type: "TEXT", placeholder: "+1 (555) 000-0000", isRequired: true },
            { 
                label: "Position Applying For", 
                labelKey: "position", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Software Engineer", value: "software_engineer" },
                    { label: "Product Manager", value: "product_manager" },
                    { label: "Designer", value: "designer" },
                    { label: "Marketing Specialist", value: "marketing" },
                ]
            },
            { label: "Years of Experience", labelKey: "experience_years", type: "NUMBER", placeholder: "0", isRequired: true },
            { label: "Why do you want to work with us?", labelKey: "motivation", type: "TEXT", placeholder: "Tell us about your interest...", isRequired: true },
            { label: "Are you available to start immediately?", labelKey: "immediate_start", type: "YES_NO", isRequired: true },
        ],
    },
    {
        id: "student-survey",
        title: "Student Survey",
        description: "Academic surveys, course evaluations, and feedback forms for students.",
        icon: null as any,
        category: "Education",
        features: ["Course ratings", "Anonymous", "Metrics"],
        fields: [
            { label: "Student ID (Optional)", labelKey: "student_id", type: "TEXT", placeholder: "Enter your student ID", isRequired: false },
            { label: "Course Name", labelKey: "course_name", type: "TEXT", placeholder: "e.g., Introduction to Computer Science", isRequired: true },
            { 
                label: "How would you rate this course?", 
                labelKey: "course_rating", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Excellent", value: "excellent" },
                    { label: "Very Good", value: "very_good" },
                    { label: "Good", value: "good" },
                    { label: "Fair", value: "fair" },
                    { label: "Poor", value: "poor" },
                ]
            },
            { 
                label: "How would you rate the instructor?", 
                labelKey: "instructor_rating", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Excellent", value: "excellent" },
                    { label: "Very Good", value: "very_good" },
                    { label: "Good", value: "good" },
                    { label: "Fair", value: "fair" },
                    { label: "Poor", value: "poor" },
                ]
            },
            { label: "What did you find most helpful?", labelKey: "most_helpful", type: "TEXT", placeholder: "Share what worked well...", isRequired: false },
            { label: "What could be improved?", labelKey: "improvements", type: "TEXT", placeholder: "Share your suggestions...", isRequired: false },
        ],
    },
    {
        id: "health-assessment",
        title: "Health Assessment",
        description: "HIPAA-compliant forms for patient intake and medical history.",
        icon: null as any,
        category: "Healthcare",
        features: ["Medical history", "HIPAA", "Secure"],
        fields: [
            { label: "Patient Name", labelKey: "patient_name", type: "TEXT", placeholder: "Enter full name", isRequired: true },
            { label: "Date of Birth", labelKey: "dob", type: "TEXT", placeholder: "MM/DD/YYYY", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { label: "Phone Number", labelKey: "phone", type: "TEXT", placeholder: "+1 (555) 000-0000", isRequired: true },
            { label: "Reason for Visit", labelKey: "visit_reason", type: "TEXT", placeholder: "Describe your symptoms or reason...", isRequired: true },
            { label: "Do you have any allergies?", labelKey: "has_allergies", type: "YES_NO", isRequired: true },
            { label: "Are you currently taking any medications?", labelKey: "taking_medications", type: "YES_NO", isRequired: true },
        ],
    },
    {
        id: "contest-entry",
        title: "Contest Entry",
        description: "Engaging contests with entry forms that capture and validate participants.",
        icon: null as any,
        category: "Marketing",
        features: ["Validation", "Social sharing", "Terms"],
        fields: [
            { label: "Full Name", labelKey: "full_name", type: "TEXT", placeholder: "Enter your full name", isRequired: true },
            { label: "Email Address", labelKey: "email", type: "EMAIL", placeholder: "your@email.com", isRequired: true },
            { label: "Phone Number", labelKey: "phone", type: "TEXT", placeholder: "+1 (555) 000-0000", isRequired: false },
            { 
                label: "How did you hear about this contest?", 
                labelKey: "referral_source", 
                type: "MULTIPLE_CHOICE", 
                isRequired: true,
                options: [
                    { label: "Social Media", value: "social_media" },
                    { label: "Email", value: "email" },
                    { label: "Friend/Family", value: "referral" },
                    { label: "Website", value: "website" },
                    { label: "Other", value: "other" },
                ]
            },
            { label: "Why should you win?", labelKey: "why_win", type: "TEXT", placeholder: "Tell us in 100 words or less...", isRequired: true },
            { label: "I agree to the terms and conditions", labelKey: "agree_terms", type: "YES_NO", isRequired: true },
        ],
    },
];
