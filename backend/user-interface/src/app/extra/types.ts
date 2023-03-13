export interface Report {
    _id: string
    title: string
    link: string
    summary: string
    updated: string
    category: string
    id: string
    accessionNumber: string
    shortId: number
    filingReportUrl: string
    objectID: string
    reportFileName: string
    reportUrl: string
    processed?: 'yes'| 'no'| 'unsure'
    description?: string
}

export interface ReportSaveResponse {
    algolia: {
        objectID: string
        taskID: string
    }
    mongo: {
        acknowledged: true,
        modifiedCount: number
        upsertedId: string
        matchedCount: number
    }
}
