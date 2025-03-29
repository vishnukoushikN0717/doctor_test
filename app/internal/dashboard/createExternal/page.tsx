"use client";

import ExternalLayout from "../../InternalLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { states } from "lib/location-data";
import { Loader2 } from "lucide-react";

// Import our custom components
import PersonalInformation from "@/components/AccountManager/personalInformation";
import JobInformation from "@/components/AccountManager/JobInformation";
import LocationInformation from "@/components/AccountManager/LocationInformation";
import ContactInformation from "@/components/AccountManager/contactInformation";
import SocialMedia from "@/components/AccountManager/SocialMedia";
import CompanyInformation from "@/components/AccountManager/CompanyInfromation";
import FormActions from "@/components/AccountManager/FormActions";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const formSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  userRole: z.string().min(1, "User type is required"),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  jobRole: z.string().optional(),
  wavExternalUserId: z.string().optional(),
  regionAllocated: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional(),
  division: z.string().optional(),
  subdivision: z.string().optional(),
  sector: z.string().optional(),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  faxNumber: z.string().optional(),
  linkedinID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  companyType: z.string().optional(),
  companyId: z.string().optional(),
});

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background border shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm font-medium text-muted-foreground">Creating Account...</p>
    </div>
  </div>
);

export default function CreateExternalAccount() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      jobRole: "",
      wavExternalUserId: "",
      email: "",
      state: "",
      city: "",
      county: "",
      zipCode: "",
      address: "",
      mapLink: "",
      divisionalGroup: "",
      division: "",
      subdivision: "",
      sector: "",
      phone: "",
      alternatePhone: "",
      faxNumber: "",
      linkedinID: "",
      facebookID: "",
      instagramID: "",
      twitterID: "",
      companyType: "",
      companyId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const requestBody = {
        email: values.email || "string",
        userRole: values.userRole || "string",
        firstName: values.firstName || "string",
        lastName: values.lastName || "string",
        phone: values.phone || "string",
        companyId: values.companyId || "string",
        dob: values.dob || "string",
        gender: values.gender || "string",
        address: values.address || "string",
        city: values.city || "string",
        state: values.state || "string",
        zipCode: values.zipCode || "string",
        county: values.county || "string",
        jobRole: values.jobRole || "string",
        jobDepartment: values.divisionalGroup || "string",
        regionAllocated: values.regionAllocated || "string",
        faxNumber: values.faxNumber || "string",
        linkedinID: values.linkedinID || "string",
        twitterID: values.twitterID || "string",
        facebookID: values.facebookID || "string",
        instagramID: values.instagramID || "string",
        middleName: values.middleName || "string",
        mapLink: values.mapLink || "string",
        divisionalGroup: values.divisionalGroup || "string",
        division: values.division || "string",
        subdivision: values.subdivision || "string",
        sector: values.sector || "string",
        website: "string",
        doximityID: "string"
      };

      const response = await fetch('/api/AccountManager/WAVExternalUser', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create account: ${response.statusText}`);
      }

      toast.success("Account Created Successfully");

      // Set the account tab preference to external before redirecting
      localStorage.setItem("accountTabPreference", "external");

      router.push("/internal/dashboard/account");
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      setApiError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ExternalLayout>
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {isSubmitting && <LoadingOverlay />}
        <div className="flex-none p-4 border-b bg-background">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {/* <span className="text-blue-600 font-medium">Dashboard</span>
            <span>/</span>
            <span>Create External Account</span> */}
          </div>
          <h1 className="text-xl font-semibold mt-1">Create External Account</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {apiError && <div className="text-red-500">{apiError}</div>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-[1200px] mx-auto">
              {/* Personal Information */}
              <PersonalInformation form={form} requiredFields={["email"]} />

              {/* Job Information */}
              <JobInformation
                form={form}
                requiredFields={["userRole"]}
                roleOptions={[
                  { value: "External Admin", label: "External Admin" },
                  { value: "External User", label: "External User" }
                ]}
                showWavExternalId={true}
              />

              {/* Location Information */}
              <LocationInformation
                form={form}
                states={states}
                addressField="address"
                zipcodeField="zipCode"
              />

              {/* Contact Information */}
              <ContactInformation
                form={form}
                phoneField="phone"
                faxField="faxNumber"
              />

              {/* Social Media */}
              <SocialMedia
                form={form}
                fieldNames={{
                  linkedin: "linkedinID",
                  facebook: "facebookID",
                  instagram: "instagramID",
                  twitter: "twitterID"
                }}
              />

              {/* Company Information */}
              <CompanyInformation form={form} />

              {/* Form Actions */}
              <FormActions
                isSubmitting={isSubmitting}
                onCancel={() => {
                  // Set preference before redirecting back
                  localStorage.setItem("accountTabPreference", "external");
                  router.push("/internal/dashboard/account");
                }}
              />
            </form>
          </Form>
        </div>
      </div>
    </ExternalLayout>
  );
}