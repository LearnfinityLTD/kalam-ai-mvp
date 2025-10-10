"use client";
import React from "react";
import { FileText, AlertCircle, Scale, Shield } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-6">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: October 10, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to VerifyLearn. These Terms of Use govern your access to
                and use of our website, services, and platform. By accessing or
                using VerifyLearn, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read these Terms carefully before using our services. If
                you do not agree to these Terms, you may not access or use our
                services.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Acceptance of Terms
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                By creating an account, submitting a course for verification, or
                using any of our services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and our Privacy
                Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes via email or through a
                prominent notice on our website. Your continued use of our
                services after such modifications constitutes acceptance of the
                updated Terms.
              </p>
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Eligibility
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old to use our services. By using
                VerifyLearn, you represent and warrant that:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You are at least 18 years of age</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You have the legal capacity to enter into a binding
                    agreement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You will comply with all applicable laws and regulations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    All information you provide is accurate and current
                  </span>
                </li>
              </ul>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Services Description
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                VerifyLearn provides independent course verification services,
                including:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>
                    Plagiarism detection and content originality assessment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Instructor credential verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Content quality and currency evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Pedagogical quality assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Detailed verification reports and scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Verified badge for qualifying courses</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any
                aspect of our services at any time without prior notice.
              </p>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                User Accounts and Registration
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use certain features of our services, you must create an
                account. You agree to:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Provide accurate, complete, and current information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Promptly update your account information as needed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Not share your account with others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for all activities that occur under your
                account. We reserve the right to suspend or terminate accounts
                that violate these Terms.
              </p>
            </div>

            {/* Course Submission */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Submission and Content Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you submit a course for verification, you represent and
                warrant that:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You own or have the necessary rights to the submitted
                    content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    The content does not infringe on third-party intellectual
                    property rights
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    The content does not contain illegal, harmful, or offensive
                    material
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    All instructor credentials provided are accurate and
                    verifiable
                  </span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                By submitting content, you grant VerifyLearn a limited,
                non-exclusive license to access, review, analyze, and process
                your content solely for the purpose of providing verification
                services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not claim ownership of your content and will not use it
                for any purpose other than verification services without your
                express permission.
              </p>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment and Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Pricing:</strong> Our current pricing is £299 for
                standard verification (48-72 hours) and £499 for priority
                verification (24-48 hours). Prices are subject to change with
                notice.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Payment:</strong> Payment is required in full before
                verification begins. We accept major credit cards and other
                payment methods as indicated on our website.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Refund Policy:</strong> Due to the nature of our
                services (expert review begins immediately), we generally do not
                offer refunds once verification has commenced. However, we may
                provide refunds at our discretion in cases where:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    We are unable to complete the verification due to technical
                    issues on our end
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You cancel within 24 hours of payment and before review has
                    begun
                  </span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Free Re-verification:</strong> Courses that do not
                achieve verified status (score below 75) are eligible for one
                free re-verification after implementing recommended
                improvements.
              </p>
            </div>

            {/* Verification Process */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verification Process and Results
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Turnaround Time:</strong> We aim to complete standard
                verifications within 48-72 hours and priority verifications
                within 24-48 hours. These are estimates and not guarantees.
                Delays may occur due to complexity or other factors.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Review Process:</strong> All courses are reviewed by
                qualified experts using our standardized methodology. Reviews
                are conducted independently and objectively.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Verification Results:</strong> You will receive a
                detailed report including a 0-100 score and category-specific
                feedback. Courses scoring 75 or higher receive the VerifyLearn
                Verified badge.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Final Decisions:</strong> All verification decisions are
                final. While we strive for accuracy, verification results
                represent professional opinions and may be subject to reasonable
                differences in expert judgment.
              </p>
            </div>

            {/* Prohibited Conduct */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Prohibited Conduct
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Violate any applicable laws or regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>
                    Submit fraudulent, misleading, or false information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>
                    Attempt to manipulate or game the verification process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Interfere with or disrupt our services or servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>
                    Use automated systems to access our services without
                    permission
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>
                    Reverse engineer or attempt to extract source code
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>
                    Misuse the VerifyLearn badge or misrepresent verification
                    results
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Harass, threaten, or abuse our staff or reviewers</span>
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Intellectual Property Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The VerifyLearn website, services, and all related content,
                including but not limited to text, graphics, logos, icons,
                images, software, and methodology, are the property of
                VerifyLearn and are protected by copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not copy, modify, distribute, sell, or lease any part of
                our services or included software, nor may you reverse engineer
                or attempt to extract the source code of that software.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The VerifyLearn name, logo, and verified badge are trademarks of
                VerifyLearn Ltd. You may not use these marks without our prior
                written permission.
              </p>
            </div>

            {/* Badge Usage */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verified Badge Usage
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If your course receives verified status, you are granted a
                limited, non-exclusive, non-transferable license to display the
                VerifyLearn Verified badge in connection with that specific
                course, subject to the following:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    The badge must link back to your verification report or our
                    website
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You may not modify the badge design or appearance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You may not use the badge for any course that has not been
                    verified
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must remove the badge if verification is revoked
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Verification is valid for 2 years from the date of
                    verification
                  </span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to revoke badge usage rights if these terms
                are violated or if course content changes substantially after
                verification.
              </p>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Disclaimers and Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Services &quot;As Is&quot;:</strong> Our services are
                provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind, either express or implied, including but
                not limited to warranties of merchantability, fitness for a
                particular purpose, or non-infringement.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>No Guarantee of Results:</strong> While we strive for
                accuracy and thoroughness, we do not guarantee that verification
                will result in increased sales, enrollments, or any specific
                business outcome.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Limitation of Liability:</strong> To the fullest extent
                permitted by law, VerifyLearn shall not be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits or revenues, whether incurred
                directly or indirectly, or any loss of data, use, goodwill, or
                other intangible losses resulting from:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Your use or inability to use our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Any unauthorized access to or use of our servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Any errors or omissions in verification reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Any other matter relating to our services</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our total liability for any claims under these Terms shall not
                exceed the amount you paid us for the service in question.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless VerifyLearn,
                its officers, directors, employees, agents, and affiliates from
                any claims, liabilities, damages, losses, costs, or expenses
                (including reasonable attorneys&apos; fees) arising from your
                use of our services, violation of these Terms, or infringement
                of any intellectual property or other rights of any third party.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of England and Wales, without regard to its
                conflict of law provisions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any disputes arising out of or relating to these Terms or our
                services shall be resolved through binding arbitration in
                accordance with the rules of the London Court of International
                Arbitration, except that either party may seek injunctive relief
                in court for matters relating to intellectual property rights.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to waive any right to a jury trial or to participate
                in a class action lawsuit.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and
                access to our services at any time, with or without cause or
                notice, if we believe you have violated these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use our services will
                immediately cease. All provisions of these Terms that by their
                nature should survive termination shall survive, including
                ownership provisions, warranty disclaimers, indemnity, and
                limitations of liability.
              </p>
            </div>

            {/* Miscellaneous */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Miscellaneous
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Entire Agreement:</strong> These Terms constitute the
                entire agreement between you and VerifyLearn regarding our
                services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Severability:</strong> If any provision of these Terms
                is found to be unenforceable, the remaining provisions will
                continue in full force and effect.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Waiver:</strong> Our failure to enforce any right or
                provision of these Terms will not constitute a waiver of such
                right or provision.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Assignment:</strong> You may not assign or transfer
                these Terms without our prior written consent. We may assign
                these Terms without restriction.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Use, please
                contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@verifylearn.com
                </p>
                <p>
                  <strong>Address:</strong> VerifyLearn Ltd, London, United
                  Kingdom
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
