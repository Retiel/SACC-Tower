import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import commandCenterPage from '../../client/index.html'

UiPage({
    $id: Now.ID['sacc-command-center'],
    endpoint: 'x_920325_sacctower_command_center.do',
    description: 'Super Admin Command Center - Dashboard for managing custom scopes, debugging processes, measuring performance, and AI-assisted development',
    category: 'general',
    html: commandCenterPage,
    direct: true,
})
