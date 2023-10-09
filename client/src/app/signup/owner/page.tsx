"use client"
import { IOwnerSignupInitialValues } from "@/Types";
import AllSocietyAutoCompletor from "@/components/common/AllSocietyAutoCompletor";
import PublicFooter from "@/components/landingpage/PublicFooter"
import PublicHeader from "@/components/landingpage/PublicHeader"
import SelectProperty from "@/components/signup/owner/selectProperty";
import { App } from "@/constants"
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";


const steps = ['Select Property', 'Personnel Details', 'Upload Documents', 'Review your details'];

const initialValues = {allSocieties: {} , towerNumber: '',flatNumber: ''} as IOwnerSignupInitialValues


const OwnerSignup = () => {
    const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        onSubmit: (value) => {
            console.log('Form submitted with ', value)
        }
    })

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {setActiveStep(activeStep + 1); handleSubmit()};
    const handleBack = () => {setActiveStep(activeStep - 1);};
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <SelectProperty values={values} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
            case 1:
                return <>Personnel Details component</>;
            case 2:
                return <>Upload Document Componnet</>;
            case 3:
                return <>Review details component</>;
            default:
                throw new Error('Unknown step');
        }
    }

    return <>
        <Box className='full_viewport_height' style={{ background: App.Background }}>
            <PublicHeader />
            <Box >
                <Container>
                    <form onSubmit={handleSubmit} noValidate >
                        <Container component="main" sx={{ mb: 4 }}>
                            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                                <Typography component="h1" variant="h4" align="center">
                                    Owner Signup
                                </Typography>
                                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === steps.length ? (
                                    <React.Fragment>
                                        <Typography variant="h5" gutterBottom>
                                            Thank you for your order.
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Your order number is #2001539. We have emailed your order
                                            confirmation, and will send you an update when your order has
                                            shipped.
                                        </Typography>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {getStepContent(activeStep)}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {activeStep !== 0 && (
                                                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                                    Back
                                                </Button>
                                            )}
                                            <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                sx={{ mt: 3, ml: 1 }}
                                            >
                                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                            </Button>
                                        </Box>
                                    </React.Fragment>
                                )}
                            </Paper>
                        </Container>
                    </form>
                </Container>
            </Box>
            <PublicFooter />
        </Box>
    </>
}

export default OwnerSignup