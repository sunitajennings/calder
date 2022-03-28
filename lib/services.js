const retry = async (retryableFunction, maxAttempts) => {
    const execute = async (attempt) => {
        try {
            return await retryableFunction()

        } catch (err) {
            if (attempt <= maxAttempts) {
                const nextAttempt = attempt + 1
                const delayInSeconds = Math.max(Math.min(Math.pow(2, nextAttempt) + randInt(-nextAttempt, nextAttempt), 600), 1) //retry after 2^n + rand seconds for the nth attempt
                console.log('Retrying after ${delayInSeconds} seconds due to ' + err)
                return delay(() => execute(nextAttempt), delayInSeconds * 1000)

            } else {
                throw err
            }
        }
    }
    return execute(1)
}

//const delay = (retryableFunction, ms) => new Promise