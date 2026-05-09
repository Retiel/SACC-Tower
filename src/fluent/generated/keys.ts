import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'd2ffd7a934854b83837df458690332ad'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'd5075cbac9324f6fa04101b6c86efbcc'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '3df14817fd1d4fdcb5d0cbddb6efbb65'
                        key: {
                            application_file: '55dade8fe1bf4d28817699a5f6be48c6'
                            source_artifact: '596b9dedc34a4af8ab19fbfd538df26e'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '46715a5718f149efb13a22e98c38767f'
                        key: {
                            application_file: 'db511df6db2f424c9e7a0cebb0607f46'
                            source_artifact: '596b9dedc34a4af8ab19fbfd538df26e'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '55dade8fe1bf4d28817699a5f6be48c6'
                        key: {
                            endpoint: 'x_920325_sacctower_command_center.do'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '596b9dedc34a4af8ab19fbfd538df26e'
                        key: {
                            name: 'x_920325_sacctower_command_center.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '5f5008e5e199415ca88a96e66e3741b3'
                        key: {
                            application_file: 'c6004f8476d84cffb099bbd41403d632'
                            source_artifact: '596b9dedc34a4af8ab19fbfd538df26e'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'c6004f8476d84cffb099bbd41403d632'
                        key: {
                            name: 'x_920325_sacctower/main.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'db511df6db2f424c9e7a0cebb0607f46'
                        key: {
                            name: 'x_920325_sacctower/main'
                        }
                    },
                ]
            }
        }
    }
}
