"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ExternalLayout from "../../../InternalLayout";
import { Form } from "@/components/ui/form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { states } from "@/lib/location-data";

// Import our custom components
import PageHeader from "@/components/AccountManager/pageheader";
import AccountInformation from "@/components/AccountManager/AccountInformation";
import EditFormActions from "@/components/AccountManager/EditFormActions";
import PersonalInformation from "@/components/AccountManager/personalInformation";
import JobInformation from "@/components/AccountManager/JobInformation";
import LocationInformation from "@/components/AccountManager/LocationInformation";
import ContactInformation from "@/components/AccountManager/contactInformation";
import SocialMedia from "@/components/AccountManager/SocialMedia";
// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

interface UserProfile {
  id: string;
  email: string;
  userRole: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  jobRole: string;
  wavExternalUserId: string;
  regionAllocated: string;
  state: string;
  city: string;
  county: string;
  zipCode: string;
  address: string;
  mapLink: string;
  divisionalGroup: string;
  division: string;
  subdivision: string;
  sector: string;
  phone: string;
  alternatePhone: string;
  faxNumber: string;
  linkedinID: string;
  facebookID: string;
  instagramID: string;
  twitterID: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  userRole: z.string().min(1, "User role is required"),
  firstName: z.string().optional().or(z.literal("")),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  jobRole: z.string().optional().or(z.literal("")),
  wavExternalUserId: z.string().optional().or(z.literal("")),
  regionAllocated: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  county: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional().or(z.literal("")),
  division: z.string().optional().or(z.literal("")),
  subdivision: z.string().optional().or(z.literal("")),
  sector: z.string().optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  faxNumber: z.string().optional().or(z.literal("")),
  linkedinID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal(""))
});

export default function EditExternalProfile() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userRole: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      jobRole: "",
      wavExternalUserId: "",
      regionAllocated: "",
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
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/AccountManager/WAVExternalUser/${params.id}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        setOriginalData(data);

        // Reset form with data, ensuring empty strings for undefined values
        form.reset({
          email: data.email || "",
          userRole: data.userRole || "",
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          dob: data.dob || "",
          gender: data.gender || "",
          jobRole: data.jobRole || "",
          wavExternalUserId: data.wavExternalUserId || "",
          regionAllocated: data.regionAllocated || "",
          state: data.state || "",
          city: data.city || "",
          county: data.county || "",
          zipCode: data.zipCode || "",
          address: data.address || "",
          mapLink: data.mapLink || "",
          divisionalGroup: data.divisionalGroup || "",
          division: data.division || "",
          subdivision: data.subdivision || "",
          sector: data.sector || "",
          phone: data.phone || "",
          alternatePhone: data.alternatePhone || "",
          faxNumber: data.faxNumber || "",
          linkedinID: data.linkedinID || "",
          facebookID: data.facebookID || "",
          instagramID: data.instagramID || "",
          twitterID: data.twitterID || "",
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error("Failed to fetch user data");
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const updatedData = {
        ...originalData,
        ...values,
      };

      const response = await fetch(`/api/AccountManager/WAVExternalUser/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      toast.success("Profile updated successfully");
      router.push(`/internal/dashboard/external-profile/${params.id}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ExternalLayout>
      <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
        {/* Page Header with Breadcrumb */}
        <PageHeader
          title="Edit External Profile"
          onBackToAccounts={() => router.push('/internal/dashboard/account')}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information */}
            <AccountInformation
              form={form}
              roleOptions={[
                { value: "External Admin", label: "External Admin" },
                { value: "External User", label: "External User" }
              ]}
            />

            {/* Personal Information */}
            <PersonalInformation form={form} />

            {/* Job Information */}
            <JobInformation
              form={form}
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

            {/* Form Actions */}
            <EditFormActions
              isLoading={isLoading}
              onCancel={() => router.back()}
            />
          </form>
        </Form>
      </div>
    </ExternalLayout>
  );
}