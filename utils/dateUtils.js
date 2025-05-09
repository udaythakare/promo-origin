export const prepareFormDataForSubmission = (formData) => {
    // Create a copy to avoid modifying the original
    const submissionData = { ...formData };

    // Ensure dates are in the correct format for the backend
    if (submissionData.start_date) {
        const startDate = new Date(submissionData.start_date);
        if (!isNaN(startDate.getTime())) {
            // Format as ISO string, which the server will handle
            submissionData.start_date = startDate.toISOString();
        }
    }

    if (submissionData.end_date) {
        const endDate = new Date(submissionData.end_date);
        if (!isNaN(endDate.getTime())) {
            // Format as ISO string, which the server will handle
            submissionData.end_date = endDate.toISOString();
        }
    }

    return submissionData;
};