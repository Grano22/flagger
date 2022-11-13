enum FlaggerFeatureStatus {
    DISABLED = "DISABLED", // Feature is disabled and cannot be activated during app work
    ACTIVATED = "ACTIVATED", // Feature is activated
    DEACTIVATED = 'DEACTIVATED', // Feature is deactivated by constraint or other thing
    INACTIVE = "INACTIVE", // Feature is awaiting to next state but is neutral and not activated
    BLOCKED = "BLOCKED", // Feature cannot be used because is blocked by client for instance notifications
    DAMAGED = "DAMAGED" // Feature got error so is marked as damaged (critical issue)
}

export default FlaggerFeatureStatus;