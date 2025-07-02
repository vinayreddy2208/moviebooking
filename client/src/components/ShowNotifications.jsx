import { notifications } from "@mantine/notifications"
import { IconQuestionMark, IconCheck, IconX } from "@tabler/icons-react"

export const WarningNotification = (title, message) => {
    notifications.show({
        title,
        message: message || undefined,
        radius: 'md',
        color: 'orange',
        icon: <IconQuestionMark />,
        withCloseButton: true,
        withBorder: true,
        autoClose: 2500,
        position: 'top-center',
        styles: {
            notification: {
                display: 'flex',
                width: '400px'
            },
        }
    })
}

export const SuccessNotification = (title = "Placeholder Text") => {
    notifications.show({
        title,
        radius: 'md',
        color: 'green',
        icon: <IconCheck />,
        withCloseButton: true,
        withBorder: true,
        autoClose: 2500,
        position: 'top-center',
    })
}

export const ErrorNotification = (title = "Placeholder Text", message) => {
    notifications.show({
        title,
        message: message || undefined,
        radius: 'md',
        color: 'red',
        icon: <IconX />,
        withCloseButton: true,
        withBorder: true,
        autoClose: 2500,
        position: 'top-center',
    })
}